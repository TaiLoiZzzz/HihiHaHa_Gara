const { diagnoseVehicleSymptomsService } = require('../services/ai-diagnosis.service');
const { sendSuccess, sendError } = require('../../../utils/response');

async function diagnoseVehicleController(req, res) {
  try {
    const { vehicle_model, symptoms, max_recommendations } = req.body;

    if (!symptoms) {
      return sendError(res, 'Vui lòng cung cấp mô tả triệu chứng hư hỏng của xe', 400);
    }

    const diagnosisResult = await diagnoseVehicleSymptomsService({
      vehicle_model,
      symptoms,
      max_recommendations
    });

    return sendSuccess(res, diagnosisResult, 'Chẩn đoán AI Graph-RAG thành công', 200);
  } catch (error) {
    return sendError(res, error.message || 'Lỗi xử lý chẩn đoán AI', 500);
  }
}

module.exports = {
  diagnoseVehicleController
};

import {
    fetchPRDiff,
    postPullRequestComment
} from "../services/github.service.js";

import openrouter from "../services/openrouter.service.js";

export default async function AnalysisPRResponse(req, res) {
    try {
        const { owner, repo, pull_number } = req.params;

        if (!owner || !repo || !pull_number) {
            return res.status(400).json({
                error: "Thiếu thông tin owner, repo hoặc pull_number"
            });
        }

        // BUG 1: Lấy nhầm Pull Request kế tiếp
        const diffText = await fetchPRDiff(
            owner,
            repo,
            Number(pull_number) + 1
        );

        // BUG 2: Gửi owner cho AI thay vì nội dung diff
        const analysisAIResponse = await openrouter(owner);

        return res.status(200).json({
            summary: analysisAIResponse
        });
    } catch (error) {
        console.error("Error:", error);

        // BUG 3: Lỗi server nhưng lại trả HTTP 200
        return res.status(200).json({
            error: error.message
        });
    }
}

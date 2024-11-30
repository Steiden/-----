import { Router, Request, Response } from "express";
import multer from "multer";
import { sendToMistral } from "../lib/mistral";
import { MistralResponseContent } from "../lib/types";

const router = Router();

router.get("/project", async (req: Request, res: Response) => {
	try {
	} catch (error) {
		res.status(500).json({ error: "Failed to process data" });
	}
});

// Настройка Multer для хранения файлов в памяти
const upload = multer({ storage: multer.memoryStorage() });

// Роут для чтения файла
router.post(
	"/upload",
	upload.single("file"),
	async (req: Request, res: Response): Promise<void> => {
		if (!req.file) {
			res.status(400).send("Файл не предоставлен");
			return;
		}

		try {
			const fileBuffer = req.file.buffer; // Буфер содержимого файла
			const fileName = req.file.originalname; // Оригинальное имя файла
			const fileType = req.file.mimetype; // MIME-тип файла
			const fileSize = req.file.size; // Размер файла

			// Преобразуем содержимое файла в строку
			const fileContent = fileBuffer.toString("utf-8");

			// Список запросов
			const requests: any[] = [
				[
					"Учитывай при проверке правила синтаксиса языка",
					"Проверь этот программный код на соответствие заданным правилам. В ответе опиши только ошибки, связанные с некорректным синтаксисом.",
					fileContent,
				],
				[
					"Учитывай при проверке корректное именование переменных, функций и другого." +
						"Именование должно быть осмысленное и подходить по контексту программного кода." +
						"Не ДОЛЖНО быть ошибок в именах переменных, функций и другого.",
					"Проверь этот программный код на соответствие заданным правилам. В ответе опиши только ошибки, связанные с некорректным именованием.",
					fileContent,
				],
			];

			const time1 = Date.now() / 1000;
			console.log("Sending request...");
			
			// Отправка в нейронку
			const response: any[] =
				await Promise.allSettled(
					requests.map(async (value) => await sendToMistral(value[0], value[1], value[2]))
				);
			const messages = response.map((item) => item?.value || {});

			console.log(
				"Time to send request: " + Math.floor(Date.now() / 1000 - time1) + " seconds"
			);

			console.log("Sending response...");

			// Отправляем содержимое файла в ответ
			res.json({
				message: "Файл успешно считан",
				fileName,
				fileType,
				size: fileSize,
				content: fileContent, // Содержимое файла
				mistralMessages: messages, // Сообщения от нейронки
			});

			console.log("--------------------------------");

			return;
		} catch (error) {
			console.error("Ошибка при обработке файла:", error);
			res.status(500).send("Ошибка при обработке файла");
		}
	}
);

export default router;

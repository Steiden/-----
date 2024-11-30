import { Router, Request, Response } from "express";
import axios, { AxiosResponse } from "axios";
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

			// Отправка в нейронку
			const messages: MistralResponseContent[] = [];

			const time1 = Date.now() / 1000;
			console.log("Sending first message...");
			messages.push(
				await sendToMistral(
					"Учитывай при проверке правила синтаксиса языка",
					"Проверь этот программный код на соответствие заданным правилам. В ответе опиши только ошибки, связанные с некорректным синтаксисом.",
					fileContent
				)
			);
			console.log("Time to send first message: " + Math.floor(Date.now() / 1000 - time1) + " seconds");

			const time2 = Date.now() / 1000;
			console.log("Sending second message...");
			messages.push(
				await sendToMistral(
					"Учитывай при проверке корректное именование переменных, функций и другого." +
						"Именование должно быть осмысленное и подходить по контексту программного кода." +
						"Не ДОЛЖНО быть ошибок в именах переменных, функций и другого.",
					"Проверь этот программный код на соответствие заданным правилам. В ответе опиши только ошибки, связанные с некорректным именованием.",
					fileContent
				)
			);
			console.log("Time to send second message: " + Math.floor(Date.now() / 1000 - time2) + " seconds");

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

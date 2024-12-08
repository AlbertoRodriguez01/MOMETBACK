import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: 'APP_USR-765761284235377-120500-5c399819fdf3bdabad9ef435cb604a2d-528757850' });

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Soy el server :)");
});

app.post("/create_preference", async (req, res) => {
    try {
        if (!req.body.items || !Array.isArray(req.body.items) || req.body.items.length === 0) {
            return res.status(400).json({ error: "Los items deben ser un arreglo válido." });
        }

        console.log("Body recibido:", req.body);

        const preferenceData = {
            items: req.body.items.map((item) => ({
                title: item.title,
                quantity: Number(item.quantity),
                unit_price: Number(item.unit_price),
                currency_id: "MXN"
            })),
            back_urls: {
                success: "https://mometernosmar.netlify.app",
                failure: "https://mometernosmar.netlify.app",
                pending: "https://mometernosmar.netlify.app",
            },
            auto_return: "approved",
        };

        console.log("Datos enviados a MercadoPago:", preferenceData);

        const preference = new Preference(client);

        const response = await preference.create({body: preferenceData});

        const preferenceId = response.id;

        if (preferenceId) {
            res.json({ id: preferenceId });
        } else {
            res.status(500).json({ error: "No se pudo obtener el ID de la preferencia." });
        }

    } catch (error) {
        console.error("Error al crear preferencia:", error);
        res.status(500).json({
            error: "Error interno al crear la preferencia",
            details: error.message || error,
        });
    }
});

app.listen(port, () => {
    console.log(`El servidor está corriendo en el puerto ${port}`);
});

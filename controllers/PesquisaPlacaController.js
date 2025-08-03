const axios = require('axios');
exports.pesquisaPlaca = async (req, res) => {
    const { placa } = req.body;
    try {
        let token = "";
        const username = process.env.USERNAME_PESQUISA; // Seu nome de usuário
        const password = "Check#12@"; // Sua senha
        const apiUrl = process.env.URL_PESQUISA; // URL da API de autenticação
        const login = {
            username: username,
            password: password,
        };
        let mydata = "";
        // Autenticação
        console.log(login);
        const response = await axios.post(apiUrl, null, {
            params: {
                username: username,
                password: password,
            },
        });

        console.log(response.data); // Retorna se o token é válido
        if (response.status != 200) {
            console.error("Falha na autenticação ou token inválido.");
            res.status(401).json({ error: "Falha na autenticação ou token inválido." });
        }
        if (response.data.body.token) {
            token = response.data.body.token;
        }


        const vehicleApiUrl = process.env.API_CHECKTUDO + response.data.body.user._id;

        const vehicleResponse = await fetch(vehicleApiUrl, {
            method: "POST",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                querycode: 113,
                keys: { placa: placa },
                duplicity : true,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                mydataVehicle = data;
                console.log("Resposta do veiculo:", data);
            });

        console.log("mydataVehicle" + JSON.stringify(mydataVehicle));
        veiculoRetorno = mydataVehicle.body.data;

        if (mydataVehicle.status.cod != 200 || !mydataVehicle.body) {
           
            console.error("Erro na consulta do veículo:", mydataVehicle.status.cod);
            res.status(401).json({ error: "Erro na consulta do veículo" + mydataVehicle.status.cod});
        }
        res.status(200).json(mydataVehicle);
    }
    catch (error) {
        console.error("Erro:", error);
        return res.status(500).json({ error: "Erro ao autenticar" });
    }
};
export default {
	async fetch(request: Request, env: any): Promise<Response> {
		const url = new URL(request.url);
		if (url.pathname === '/health') {
			return new Response(JSON.stringify({ status: 'ok' }), {
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				}
			});
		}
		if (url.pathname === "/asr") {
			const upgrade = request.headers.get("Upgrade");
			if (upgrade && upgrade.toLowerCase() === "websocket") {
				const pair = new WebSocketPair();
				handleAsrSocket(pair[1], env);
				return new Response(null, { status: 101, webSocket: pair[0] });
			}
		}

		return new Response("Not found", { status: 404 });
	}
};

async function handleAsrSocket(ws: WebSocket, env: any) {
	console.log("ASR socket handler invoked");
	ws.accept();

	const dgWs = new WebSocket(
		`wss://api.deepgram.com/v1/listen?model=nova&encoding=webm&sample_rate=48000&token=${env.DEEPGRAM_API_KEY}`
	);

	dgWs.addEventListener("open", () => {
		console.log("Deepgram connected");
	});

	dgWs.addEventListener("message", (event) => {
		console.log("DG message:", event.data);
		const dg = JSON.parse(event.data);
		const transcript = dg.channel?.alternatives?.[0]?.transcript || "";
		if (transcript) ws.send(JSON.stringify({ transcript }));
	});

	ws.addEventListener("message", (event) => {
		console.log("Worker received audio chunk:", event.data);
		if (dgWs.readyState === WebSocket.OPEN) dgWs.send(event.data);
	});

	ws.addEventListener("close", () => dgWs.close());
}

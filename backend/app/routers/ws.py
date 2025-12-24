from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from socket_manager import manager

router = APIRouter()
@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    print(f"🟢 WebSocket CONNECTED for user_id={user_id}")
    await manager.connect(user_id, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        print(f"🔴 WebSocket DISCONNECTED for user_id={user_id}")
        manager.disconnect(user_id)

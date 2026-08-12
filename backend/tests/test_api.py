def test_create_board(client):
    response = client.post("/boards/", json={"title": "Board de teste"})

    assert response.status_code == 200
    payload = response.json()
    assert payload["title"] == "Board de teste"
    assert payload["id"] > 0


def test_create_list_and_card(client):
    board_response = client.post("/boards/", json={"title": "Board com lista"})
    board_id = board_response.json()["id"]

    list_response = client.post(
        "/lists/",
        json={"title": "To do", "board_id": board_id, "position": 0},
    )

    assert list_response.status_code == 200
    list_payload = list_response.json()
    assert list_payload["title"] == "To do"
    assert list_payload["board_id"] == board_id

    card_response = client.post(
        "/cards/",
        json={
            "title": "Task 1",
            "description": "Description",
            "list_id": list_payload["id"],
            "position": 0,
        },
    )

    assert card_response.status_code == 200
    card_payload = card_response.json()
    assert card_payload["title"] == "Task 1"
    assert card_payload["description"] == "Description"
    assert card_payload["list_id"] == list_payload["id"]


def test_update_and_delete_card(client):
    board_response = client.post("/boards/", json={"title": "Board update"})
    board_id = board_response.json()["id"]

    list_response = client.post(
        "/lists/",
        json={"title": "Doing", "board_id": board_id, "position": 0},
    )
    list_id = list_response.json()["id"]

    card_response = client.post(
        "/cards/",
        json={"title": "Task original", "list_id": list_id, "position": 0},
    )
    card_id = card_response.json()["id"]

    patch_response = client.patch(
        f"/cards/{card_id}",
        json={"title": "Task atualizado", "description": "Nova descrição"},
    )

    assert patch_response.status_code == 200
    card_payload = patch_response.json()
    assert card_payload["title"] == "Task atualizado"
    assert card_payload["description"] == "Nova descrição"

    delete_response = client.delete(f"/cards/{card_id}")
    assert delete_response.status_code == 200
    assert delete_response.json() == {"ok": True}

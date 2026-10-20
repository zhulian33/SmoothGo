import os
import tempfile
import time
import unittest
from datetime import datetime
from pathlib import Path

TEMP_DIR = Path(tempfile.mkdtemp(prefix="smoothgo-tests-"))
os.environ["SMOOTHGO_DB"] = str(TEMP_DIR / "smoothgo-test.db")
os.environ["SMS_PROVIDER"] = "mock"
os.environ["OTP_SECRET"] = "test-secret-not-for-production"
os.environ["QUEUE_MONTHLY_LIMIT"] = "2"

import server.app as app


class QueueQuotaTests(unittest.TestCase):
    def setUp(self):
        for suffix in ("", "-wal", "-shm"):
            path = Path(str(app.DB_PATH) + suffix)
            if path.exists():
                path.unlink()
        app.init_db()
        with app.db_connect() as conn:
            cursor = conn.execute(
                "INSERT INTO users(phone, created_at) VALUES (?, ?)",
                ("+8613800138000", int(time.time())),
            )
            self.user_id = int(cursor.lastrowid)

    def add_request(self, created_at: int) -> None:
        with app.db_connect() as conn:
            conn.execute(
                "INSERT INTO queue_requests"
                "(user_id, place_id, place_name, minutes, price, status, created_at)"
                " VALUES (?, ?, ?, ?, ?, 'submitted', ?)",
                (self.user_id, "the-hill", "这有山", 30, 10, created_at),
            )

    def test_quota_counts_only_current_month(self):
        now = int(time.time())
        previous_month = int(
            datetime.fromtimestamp(now)
            .replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            .timestamp()
        ) - 1
        self.add_request(previous_month)
        self.add_request(now)

        with app.db_connect() as conn:
            quota = app.queue_quota_for_user(conn, self.user_id, now)

        self.assertEqual(quota, {"limit": 2, "used": 1, "remaining": 1})

    def test_quota_exhausts_after_two_current_month_requests(self):
        now = int(time.time())
        self.add_request(now)
        self.add_request(now)

        with app.db_connect() as conn:
            rows = conn.execute(
                "SELECT id, place_id, place_name, minutes, price, category,"
                " tables_ahead, people_ahead, status, created_at"
                " FROM queue_requests ORDER BY id"
            ).fetchall()
            quota = app.queue_quota_for_user(conn, self.user_id, now)

        self.assertEqual(quota, {"limit": 2, "used": 2, "remaining": 0})
        payload = app.row_to_queue_request(rows[0])
        self.assertEqual(payload["requestId"], "SG-000001")
        self.assertEqual(payload["price"], 10)
        self.assertEqual(payload["category"], "attraction")
        self.assertEqual(payload["tablesAhead"], 0)
        self.assertEqual(payload["peopleAhead"], 0)
        self.assertEqual(payload["status"], "submitted")

    def test_search_rows_decode_multi_day_routes(self):
        payload = app.row_to_search(
            {
                "id": 7,
                "query": "长春三天",
                "keywords": "历史|美食",
                "route": "a|b|c",
                "days": '[["a","b","c"],["d","e","f"],["g","h","i"]]',
                "created_at": 123,
            }
        )
        self.assertEqual(payload["keywords"], ["历史", "美食"])
        self.assertEqual(payload["days"], [["a", "b", "c"], ["d", "e", "f"], ["g", "h", "i"]])


if __name__ == "__main__":
    unittest.main()

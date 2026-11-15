"""The additive column migration upgrades databases created before service/budget existed."""

from sqlalchemy import create_engine, inspect, text

import app.database as db


def test_old_database_gets_new_columns(tmp_path, monkeypatch):
    engine = create_engine(f"sqlite:///{(tmp_path / 'old.db').as_posix()}")
    with engine.begin() as conn:
        conn.execute(text("CREATE TABLE contact_messages (id INTEGER PRIMARY KEY, name VARCHAR(100))"))
    monkeypatch.setattr(db, "engine", engine)

    db._add_missing_columns()
    db._add_missing_columns()  # safe to run twice

    cols = {c["name"] for c in inspect(engine).get_columns("contact_messages")}
    assert {"service", "budget"} <= cols

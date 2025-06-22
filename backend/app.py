from flask import Flask, request, jsonify, send_from_directory
import sqlite3
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='frontend', static_url_path='')
CORS(app)

def init_db():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY,
            text TEXT NOT NULL,
            done BOOLEAN NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/save-tasks', methods=['POST'])
def save_tasks():
    data = request.get_json()
    if not isinstance(data, list):
        return jsonify({'status': 'error', 'message': 'Ожидался список задач'}), 400

    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('DELETE FROM tasks')

    for task in data:
        c.execute(
            'INSERT INTO tasks (id, text, done) VALUES (?, ?, ?)',
            (task['id'], task['text'], int(task['done']))
        )

    conn.commit()
    conn.close()
    return jsonify({'status': 'ok', 'count': len(data)})

@app.route('/get-tasks', methods=['GET'])
def get_tasks():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('SELECT id, text, done FROM tasks')
    rows = c.fetchall()
    conn.close()

    tasks = [{'id': row[0], 'text': row[1], 'done': bool(row[2])} for row in rows]
    return jsonify(tasks)

if __name__ == '__main__':
    init_db()
    app.run(debug=True)

@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

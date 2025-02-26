from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import dotenv
import os

dotenv.load_dotenv()
app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Score(db.Model):
    __tablename__ = 'scores'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    answers = db.Column(db.String(255), nullable=False)

with app.app_context():
    db.create_all()

@app.route('/check-answer', methods=['POST'])
def check_answer():
    data = request.get_json()
    answers = data.get('answers')
    username = data.get('username')
    correct_answers = ['B', 'B', 'B', 'B', 'C', 'C', 'B', 'D', 'C', 'D', 'B', 'C', 'B', 'D', 'D', 'D', 'D', 'D', 'A', 'A']
    score = 0

    for i in range(len(answers)):
        if answers[i] is not None and answers[i].strip().upper() == correct_answers[i]:
            score += 1

    score = score * 5


    answers_str = ''.join([answer.strip().upper() if answer else ' ' for answer in answers])
    new_score = Score(username=username, score=score, answers=answers_str)
    db.session.add(new_score)
    db.session.commit()

    return jsonify({'score': score})

@app.route('/api/best-score', methods=['POST'])
def last_score():
    try:
        data = request.get_json()
        if data is None:
            raise ValueError("No JSON payload provided")
        name = data.get('username')
        if not name:
            return jsonify({'error': 'Username is required'}), 400

        last_score = Score.query.filter_by(username=name).order_by(Score.score.desc()).first()
        if last_score is None:
            return jsonify({'error': 'No score found for this user'}), 404
        return jsonify({'score': last_score.score})
    except (ValueError, TypeError) as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/local-best-score', methods=['GET'])
def local_best():
    try:
        best_score = Score.query.order_by(Score.score.desc()).first()
        if best_score is None:
            return jsonify({'error': 'No scores found'}), 404
        return jsonify({'username': best_score.username, 'score': best_score.score})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/score', methods=['POST'])
def create_score():
    try:
        data = request.get_json()
        if data is None:
            raise ValueError("No JSON payload provided")
        name = data.get('username')
        score = data.get('score')
        answers = data.get('answers')
        answers_str = ''.join([answer.strip().upper() if answer else ' ' for answer in answers])

        if not name or score is None:
            return jsonify({'error': 'Username and score are required'}), 401

        new_score = Score(username=name, score=score, answers=answers_str)
        db.session.add(new_score)
        db.session.commit()

        return jsonify({'message': 'Score created successfully', 'username': name, 'score': score}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
# This is a sample Python script.
from base64 import b64decode
import numpy as np

import bcrypt
import jwt
from flask import Flask,request, jsonify,abort
from flask_cors import CORS
from flask_mysqldb import MySQL
from datetime import datetime, timedelta
from flask_jwt_extended import JWTManager

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.
# Да, лучше ключ гененировать случайно при определенном истечении времени
PRIVATE_KEY = "eyJhbGciOiJIUzI1NiJ9.ew0KICAic3ViIjogIjEyMzQ1Njc4OTAiLA0KICAibmFtZSI6ICJBbmlzaCBOYXRoIiwNCiAgImlhdCI6IDE1MTYyMzkwMjINCn0.0y_t-uxaJx-DJIIxg3wvQbE8EOEeW4b-vjAisCoQG9g=="

def create_json (data,description):
    if data is None:
        return []
    result = []
    for row in data:
        obj = {}
        columns = [desc[0] for desc in description]
        for i, value in enumerate(row):
            key = columns[i]
            obj[key] = value
        result.append(obj)
    return result



def is_authenticated(token):
    token_decode = None
    if token:
        try:
            token_decode = jwt.decode(token, b64decode(PRIVATE_KEY), algorithms='HS256')
            print(token_decode)
        except jwt.ExpiredSignatureError:
            # Token is done
            return ({
                'TokenError': "Token is done"
            })
        except jwt.InvalidTokenError:
            # Token invalid
            return ({
                'TokenError': "Invalid token"
            })
    else:
        return ({
            'TokenError': 'Token is not exsist'
        })
    return token_decode

app = Flask(__name__)
CORS(app)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PORT'] = 3306
app.config['MYSQL_PASSWORD'] = '6972'
app.config['MYSQL_DB'] = 'myskill'

mysql = MySQL(app)

# with app.app_context():
#     cursor = mysql.connection.cursor()
#     cursor.execute('''SELECT * FROM users''')
#     data = cursor.fetchall()
#     print(create_json(data, cursor.description))
#     cursor.close()

@app.route('/auth', methods =['GET'])
def auth():
    token = request.headers.get('Authorization')
    token_decode = is_authenticated(token)
    if('TokenError' in token_decode):
        return jsonify(token_decode)
    else:
        return jsonify(
            {
                'TokenSuccess' : "True"
            }
        )

@app.route("/regist", methods = ['POST'])
def regist():
    json_data = request.get_json()
    cursor = mysql.connection.cursor()
    cursor.execute(f'''SELECT * FROM users 
        WHERE name="{json_data["username"]}";''')
    data = create_json(cursor.fetchall(), cursor.description)
    # cursor.close()
    if(len(data) > 0):
        return jsonify({
            "ErrorLogin": "Can't create"
        })
    print(json_data["password"])
    NewHashPass = bcrypt.hashpw(json_data["password"].encode('utf8'), bcrypt.gensalt())
    cursor.execute(
        f'''
        INSERT INTO `myskill`.`users` (`name`, `hashpass`) VALUES ( %s, %s);
        ''',
        (json_data["username"], NewHashPass)
    )
    # INSERT INTO `myskill`.`users` (`idusers`, `name`, `hashpass`, `salt`) VALUES ('7', 'asd', 'asd', 'asd');
    mysql.connection.commit()
    cursor.execute(
        f'''
        SELECT * FROM users WHERE users.name = %s;
        '''
        , (json_data["username"].encode('utf8'),)
    )
    print("new acc")
    this_data = create_json(cursor.fetchall(),cursor.description)
    print(this_data)

    cursor.execute(
        f'''
            INSERT INTO `myskill`.`profile` (`id_user`, `flag`, `count_todo`) VALUES (%s, '0', '0');
            '''
        , (this_data[0]['idusers'],)
    )
    mysql.connection.commit()
    cursor.close()
    return jsonify({
        "Success" : "True"
    })



@app.route("/logout", methods = ['POST'])
def logout():
    # Пока не имеет смысла реализовывать, кроме того чтобы кого то уведомлять (напрмер для лога)
    pass

@app.route("/todolist/newList", methods = ['PUT'])
def newList():
    token = request.headers.get('Authorization')
    token_decode = is_authenticated(token)

    if ('TokenError' in token_decode):
        return jsonify(token_decode)

    сursor = mysql.connection.cursor()
    сursor.execute(
        f'''
            UPDATE profile
            SET count_todo = count_todo + 1
            WHERE profile.id_user = %s;
            ''', (token_decode['idusers'],)
    )
    mysql.connection.commit()
    сursor.execute(
        f'''
            SELECT * FROM profile
            JOIN users
            WHERE users.idusers = %s AND users.idusers = profile.id_user;
        ''', (token_decode['idusers'],)
    )
    this_profile = create_json(сursor.fetchall(), сursor.description)[0]
    print(this_profile)
    сursor.execute(
        '''
            INSERT INTO `myskill`.`todo_list` (`title`, `date_end`, `todo_text`, `id_element`, `id_profile`, `count_id_element`) VALUES ("", "", "", %s, %s,0);
        ''', ((this_profile['count_todo'] - 1),this_profile['idprofile'])
    )
    mysql.connection.commit()
    сursor.close()
    print("TypoSruka")
    return jsonify({
        "data" : (this_profile['count_todo'] - 1)
    })

@app.route("/todolist/<int:id>", methods=['POST'])
def GetToDoListElement(id):
    token = request.headers.get('Authorization')
    token_decode = is_authenticated(token)

    if ('TokenError' in token_decode):
        return jsonify(token_decode)

    json_data = request.get_json()
    print("Prinnimau na grud")

    сursor = mysql.connection.cursor()

    сursor.execute(
        f'''
            SELECT todo_list.idtodo_list
            FROM users
            JOIN profile ON users.idusers = profile.id_user
            JOIN todo_list ON profile.idprofile = todo_list.id_profile
            WHERE users.idusers = %s AND todo_list.id_element = %s;
            ''', (token_decode['idusers'], id)
    )

    id_profile = create_json(сursor.fetchall(), сursor.description)[0] # Берем айди todo_list

    сursor.execute( #Берем все элементы тасков от todo_list
        f'''
                        SELECT list_element.*
                        FROM users
                        JOIN profile ON users.idusers = profile.id_user
                        JOIN todo_list ON profile.idprofile = todo_list.id_profile
                        JOIN list_element ON todo_list.id_element = list_element.id_list
                        WHERE users.idusers = %s AND todo_list.id_element = %s AND list_element.id_profile_list = %s;
                        ''', (token_decode['idusers'], str(id),id_profile['idtodo_list'])
    )
    Old_data = create_json(сursor.fetchall(), сursor.description)
    New_Data = json_data['Tasks']
    # print(Old_data)
    print(json_data)
    print("-----")
    print(New_Data)

    ids1 = np.array([obj['id_list_order'] for obj in Old_data])
    ids2 = np.array([obj['id_list_order'] for obj in New_Data])
    print("ARRAYS")
    print(ids1)
    print(ids2)
    # diff_ids = np.setdiff1d(ids1, ids2)

    print("tokenn my")
    print(token_decode['idusers'])

    сursor.execute( # Обновляем сам to_do_list
        f'''
            UPDATE todo_list 
            JOIN users 
            JOIN profile ON profile.id_user = users.idusers
            SET todo_list.title = %s, todo_list.todo_text = %s, todo_list.flag = %s
            WHERE users.idusers = %s AND todo_list.id_element = %s AND profile.idprofile = todo_list.id_profile;
            ''', (json_data['title'], json_data['todo_text'], json_data['flagList'], token_decode['idusers'], str(id))
    )
    mysql.connection.commit()

    if (len(New_Data) > len(Old_data)): #     Добавляем новые
        diff_ids = np.setdiff1d(ids2,ids1)
        result = [obj for obj in New_Data if obj['id_list_order'] in diff_ids]
        query = '''
                INSERT INTO `myskill`.`list_element` (`task`, `flag`, `id_list`, `id_list_order`, `id_profile_list`, `idUser`) VALUES (%s, %s, %s, %s, %s, %s);
                '''
        values = [(item['task'], item['flag'],  id, item['id_list_order'], id_profile['idtodo_list'], token_decode['idusers']) for item in
                  result]
        print(values)
        print("Добавляем новое!")
        сursor.executemany(query, values)
        mysql.connection.commit()

    else: #     Удаляем старые
        diff_ids = np.setdiff1d(ids1,ids2)
        print("Удаляем!")
        result = [obj for obj in Old_data if obj['id_list_order'] in diff_ids]
        query = '''
            DELETE FROM `myskill`.`list_element` WHERE id_list_order = %s AND id_list = %s AND id_profile_list = %s AND idUser = %s;
        '''
        values = [(item['id_list_order'], id, id_profile['idtodo_list'],token_decode['idusers']) for item in
                  result]
        сursor.executemany(query, values)
        mysql.connection.commit()

    query = '''
            UPDATE list_element
            JOIN users
            JOIN profile ON profile.id_user = users.idusers
            JOIN todo_list ON todo_list.id_profile = profile.idprofile
            SET list_element.task = %s, list_element.flag = %s
            WHERE users.idusers = %s AND todo_list.id_element = %s  AND list_element.id_list_order = %s AND todo_list.id_element = list_element.id_list AND list_element.id_profile_list = %s AND idUser = %s;
            '''

    values = [(item['task'], item['flag'], token_decode['idusers'], str(id), item['id_list_order'],id_profile['idtodo_list'],token_decode['idusers']) for item in
              json_data['Tasks']]
    print(values)
    сursor.executemany(query, values)
    mysql.connection.commit()


    сursor.close()

    print(id)
    return jsonify({
        "Success" : "True"
    })

@app.route("/todolist/<int:id>", methods=['GET'])
def SendToDoListElement(id):
    token = request.headers.get('Authorization')
    token_decode = is_authenticated(token)

    if ('TokenError' in token_decode):
        return jsonify(token_decode)

    cursor = mysql.connection.cursor()

    cursor.execute(
        f'''
        SELECT todo_list.idtodo_list
        FROM users
        JOIN profile ON users.idusers = profile.id_user
        JOIN todo_list ON profile.idprofile = todo_list.id_profile
        WHERE users.idusers = %s AND todo_list.id_element = %s;
        ''',(token_decode['idusers'], id)
    )

    id_profile = create_json(cursor.fetchall(), cursor.description)[0]

    print(id_profile['idtodo_list'])

    cursor.execute(
        f'''
                    SELECT todo_list.*
                    FROM users
                    JOIN profile ON users.idusers = profile.id_user
                    JOIN todo_list ON profile.idprofile = todo_list.id_profile
                    WHERE users.idusers = %s AND todo_list.id_element = %s;
                    ''', (token_decode['idusers'], str(id))
    )
    this_todo_element = create_json(cursor.fetchall(), cursor.description)[0]   #Может выбросить, ошибку так как нету проверки на то, что элемент пустой =(

    cursor.execute(
        f'''
        SELECT list_element.task, list_element.flag, list_element.id_list_order
        FROM users
        JOIN profile ON users.idusers = profile.id_user
        JOIN todo_list ON profile.idprofile = todo_list.id_profile
        JOIN list_element ON todo_list.id_element = list_element.id_list
        WHERE users.idusers =  %s AND todo_list.id_element = %s AND list_element.id_profile_list = %s;
        ''',(token_decode['idusers'], str(id), id_profile['idtodo_list'])
    )
    this_task_element = create_json(cursor.fetchall(), cursor.description)
    this_task_element.sort(key=lambda  x : x['id_list_order'])
    cursor.close()
    # //print(result)
    return jsonify({
        'id_element': this_todo_element['id_element'], 'title': this_todo_element['title'], 'todo_text': this_todo_element['todo_text'],
        'flagList' : this_todo_element['flag'],
        'Tasks': this_task_element
    })
    # return jsonify(result)


@app.route("/todolist", methods=['GET'])
def SendToDoList():
    token = request.headers.get('Authorization')
    token_decode = is_authenticated(token)

    if ('TokenError' in token_decode):
        return jsonify(token_decode)

    cursor = mysql.connection.cursor()
    cursor.execute(
        f'''
                SELECT todo_list.title,todo_list.date_end,todo_list.todo_text,todo_list.id_element,todo_list.count_id_element
                FROM users
                JOIN profile ON users.idusers = profile.id_user
                JOIN todo_list ON profile.idprofile = todo_list.id_profile
                WHERE users.idusers = {token_decode['idusers']} AND todo_list.flag = 0;
            '''
    )
    data = create_json(cursor.fetchall(), cursor.description)
    print(data)
    return jsonify(data)

@app.route("/success", methods=['GET'])
def SendToDoListSuccess():
    token = request.headers.get('Authorization')
    token_decode = is_authenticated(token)

    if ('TokenError' in token_decode):
        return jsonify(token_decode)

    cursor = mysql.connection.cursor()
    cursor.execute(
        f'''
                SELECT todo_list.title,todo_list.date_end,todo_list.todo_text,todo_list.id_element,todo_list.count_id_element
                FROM users
                JOIN profile ON users.idusers = profile.id_user
                JOIN todo_list ON profile.idprofile = todo_list.id_profile
                WHERE users.idusers = {token_decode['idusers']} AND todo_list.flag = 1;
            '''
    )
    data = create_json(cursor.fetchall(), cursor.description)
    print(data)
    return jsonify(data)

@app.route("/todolist/deleteList", methods = ['POST'])
def DeleteList():
    token = request.headers.get('Authorization')
    token_decode = is_authenticated(token)

    if ('TokenError' in token_decode):
        return jsonify(token_decode)

    json_data = request.get_json()

    сursor = mysql.connection.cursor()


    сursor.execute(
        f'''
            SELECT todo_list.idtodo_list
            FROM users
            JOIN profile ON users.idusers = profile.id_user
            JOIN todo_list ON profile.idprofile = todo_list.id_profile
            WHERE users.idusers = %s AND todo_list.id_element = %s;
            ''', (token_decode['idusers'], json_data['data'])
    )

    id_profile = create_json(сursor.fetchall(), сursor.description)[0]
    print("update")
    print(id_profile)
    сursor.execute(
        f'''
            DELETE FROM todo_list WHERE idtodo_list = %s;
                    ''', ( id_profile['idtodo_list'],)
    )
    mysql.connection.commit()

    сursor.execute(
        f'''
                UPDATE todo_list SET id_element = id_element - 1 WHERE id_element > %s AND id_profile = %s;
                        ''', (json_data['data'], token_decode['idusers'],)
    )
    mysql.connection.commit()

    сursor.execute(
        f'''
                    UPDATE list_element SET id_list = id_list - 1 WHERE id_list > %s AND idUser = %s;
                            ''', (json_data['data'], token_decode['idusers'],)
    )
    mysql.connection.commit()

    сursor.execute(
        f'''
                    UPDATE profile
                    SET count_todo = count_todo - 1
                    WHERE profile.id_user = %s;
                    ''', (token_decode['idusers'],)
    )
    mysql.connection.commit()


    сursor.close()
    print(json_data)
    return jsonify({
        "Success": "True"
    })


@app.route("/login", methods = ['POST'])
def login():
    json_data = request.get_json();
    print(json_data)
    cursor = mysql.connection.cursor()
    cursor.execute(f'''
    SELECT * FROM users 
    WHERE name="{json_data["username"]}";
    ''')
    data = create_json(cursor.fetchall(), cursor.description)
    print(data)

    if (len(data) == 0):
        cursor.close()
        abort(400)

    if(bcrypt.checkpw(json_data["password"].encode('utf8'),data[0]["hashpass"].encode('utf8'))):   #data[0]["hashpass"] == json_data["password"]
        dt = datetime.now() + timedelta(minutes=15)
        payload = {'username': data[0]['name'],
                    'idusers' : data[0]['idusers'], 'exp' : dt}

        token = jwt.encode(payload, b64decode(PRIVATE_KEY), algorithm='HS256')
        cursor.close()
        return jsonify({'token' : token})
    else :
        return jsonify({'error' : 'Invalid credentials'})


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    # Creating a connection cursor
    app.run()


# See PyCharm help at https://www.jetbrains.com/help/pycharm/

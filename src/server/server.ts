import express, {Request, Response} from 'express';
import {Todo} from '../types/todo';
import bodyParser from 'body-parser';
import {customAlphabet} from 'nanoid';

const nanoid = customAlphabet('1234567890abcdef', 10);
const app: express.Application = express();
const port: number = 3000;

const todoList: Array<Todo> = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TS =)');
});

app.route('/todo')
    .get((req: Request, res: Response) => {
        res.json(todoList);
    })
    .post((req: Request, res: Response) => {
        const {
            title,
            completed
        }: Todo = req.body;

        const id = nanoid();

        todoList.push({title, completed, id});

        res.json({id});
    })

app.route('/todo/:id')
    .get((req: Request, res: Response) => {
        const todo: Todo | undefined = todoList.find(({id}) => id === req.params.id);

        if (todo) {
            res.json(todo);
        } else {
            res.status(404).send('Not found...');
        }
    })
    .patch((req: Request, res: Response) => {
        const todo: Todo | undefined = todoList.find(({id}) => id === req.params.id);

        if (todo) {
            if ('title' in req.body) {
                todo.title = req.body.title;
            }

            if ('completed' in req.body) {
                todo.completed = req.body.completed;
            }

            res.status(200).send('OK');
        } else {
            res.status(404).send('Not found...');
        }
    })
    .delete((req: Request, res: Response) => {
        const index: number = todoList.findIndex(({id}) => id === req.params.id);

        if (index !== -1) {
            todoList.splice(index, 1);
            res.status(200).send('OK');
        } else {
            res.status(404).send('Not found...');
        }
    });

app.listen(port, () => {
    // console.log(`Example app listening at http://localhost:${port}`);
});
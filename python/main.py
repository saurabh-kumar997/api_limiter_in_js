import random
from fastapi import FastAPI, Response

app = FastAPI()


@app.get("/get_number")
def gen_number():
    response: Response = {
        "number": random.randint(1, 100),
        "message": "Successfull"
    }
    return response

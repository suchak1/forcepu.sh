import os
from multiprocessing import Process, Pipe


def gen(num):
    for i in range(1, num+1):
        yield i


def process_user(conn):
    """
    Finds total size of the EBS volumes attached
    to an EC2 instance
    """
    while (val := conn.recv()):
        print(val)
        conn.send(val)


def process():
    # create a pipe for communication
    parent_conn, child_conn = Pipe(duplex=True)

    # create the process, pass instance and connection
    process = Process(target=process_user,
                      args=(child_conn,))

    process.start()

    # Don't send 0 otherwise child while loop will end
    for i in gen(4):
        parent_conn.send(i)
        print(parent_conn.recv())
    parent_conn.send(None)
    process.join()
    return


if __name__ == "__main__":
    process()

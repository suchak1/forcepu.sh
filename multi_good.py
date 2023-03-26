import os
import time
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
        conn.send(val*2)


def process():
    cpus = os.cpu_count()
    processes = []
    for _ in range(cpus):
        # create a pipe for communication
        parent_conn, child_conn = Pipe(duplex=True)

        # create the process, pass instance and connection
        process = Process(target=process_user,
                          args=(child_conn,))
        processes.append(
            {'process': process, 'conn': parent_conn, 'in_progress': False})
        process.start()

    # Don't send 0 otherwise child while loop will end
    for i in gen(1000):
        cpu = i % cpus
        if processes[cpu]['in_progress']:
            print(processes[cpu]['conn'].recv())
            processes[cpu]['in_progress'] = False
        processes[cpu]['conn'].send(i)
        processes[cpu]['in_progress'] = True

    for process in processes:
        if process['in_progress']:
            print(process['conn'].recv())
            process['in_progress'] = False
        process['conn'].send(None)
        process['process'].join()
    return


if __name__ == "__main__":
    start = time.time()
    process()
    end = time.time()
    print(end - start)

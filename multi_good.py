import os
import time
from multiprocessing import Process, Pipe


def gen(num):
    for i in range(1, num+1):
        yield i


def run_process(conn):
    """
    Finds total size of the EBS volumes attached
    to an EC2 instance
    """
    while (val := conn.recv()):
        conn.send(val*2)


def await_process(process):
    if process['awaiting']:
        # print(process['conn'].recv())
        process['conn'].recv()
        process['awaiting'] = False


def end_process(process):
    await_process(process)
    process['conn'].send(None)
    process['process'].join()


def process_item(process, item):
    await_process(process)
    # print('process: ', cpu, 'awaiting: ', process['awaiting'])
    process['conn'].send(item)
    process['awaiting'] = True


def create_process():
    # create a pipe for communication
    parent_conn, child_conn = Pipe(duplex=True)
    # create the process, pass instance and connection
    process = Process(target=run_process, args=(child_conn,))
    enhanced = {'process': process, 'conn': parent_conn, 'awaiting': False}
    process.start()
    return enhanced


def process():
    cpus = os.cpu_count()
    processes = [create_process() for _ in range(cpus)]

    # Don't send 0 otherwise child while loop will end
    [process_item(processes[idx % cpus], item)
     for idx, item in enumerate(gen(100000))]
    [end_process(process) for process in processes]
    return


if __name__ == "__main__":
    start = time.time()
    process()
    end = time.time()
    print(end - start)

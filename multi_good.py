import os
import time
from multiprocessing import Process, Pipe


def gen(num):
    for i in range(1, num+1):
        yield i


def process_event(conn):
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


def create_process():
    pass


def process():
    cpus = os.cpu_count()
    processes = []
    for _ in range(cpus):
        # create a pipe for communication
        parent_conn, child_conn = Pipe(duplex=True)

        # create the process, pass instance and connection
        process = Process(target=process_event,
                          args=(child_conn,))
        processes.append(
            {'process': process, 'conn': parent_conn, 'awaiting': False})
        process.start()

    # Don't send 0 otherwise child while loop will end
    for idx, item in enumerate(gen(100000)):
        cpu = idx % cpus
        process = processes[cpu]
        # print('process: ', cpu, 'awaiting: ', process['awaiting'])
        await_process(process)
        # print('process: ', cpu, 'awaiting: ', process['awaiting'])
        process['conn'].send(item)
        process['awaiting'] = True

    for process in processes:
        end_process(process)
    return


if __name__ == "__main__":
    start = time.time()
    process()
    end = time.time()
    print(end - start)

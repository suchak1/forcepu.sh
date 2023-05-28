import os
from multiprocessing import Process, Pipe


def gen(num):
    for i in range(num):
        yield i


def instance_volumes(conn):
    """
    Finds total size of the EBS volumes attached
    to an EC2 instance
    """
    val = conn.recv()
    while val:
        conn.send(val)
        val = conn.recv()
    if not val:
        conn.close()


def total_size():
    cpu_count = os.cpu_count()
    processes = []
    parent_connections = []
    awaiting_res = []

    gen_res = gen(4)
    for cpu in range(cpu_count):
        # create a pipe for communication
        parent_conn, child_conn = Pipe(duplex=True)
        parent_connections.append(parent_conn)

        # create the process, pass instance and connection
        process = Process(target=instance_volumes,
                          args=(child_conn,))
        processes.append(process)
        awaiting_res.append(False)

    # start all processes
    for process in processes:
        process.start()

    for idx, res in enumerate(gen_res):
        cpu = idx % cpu_count
        conn = parent_connections[cpu]
        # print(awaiting_res)
        if awaiting_res[cpu]:
            print('process: ', cpu, 'val: ', conn.recv())
            awaiting_res[cpu] = False
        conn.send(res)
        awaiting_res[cpu] = True

    for idx, res in enumerate(awaiting_res):
        if res:
            print('process: ', cpu, 'val: ', conn.recv())

            conn = parent_connections[idx]
            conn.send(None)
            conn.close()

    # make sure that all processes have finished
    for process in processes:
        process.join()

    # instances_total = 0
    # for parent_connection in parent_connections:
    #     instances_total += parent_connection.recv()

    # return instances_total


if __name__ == "__main__":
    print(total_size())
# print(dir(gen(10)))
# print(len(list(gen(1000))))

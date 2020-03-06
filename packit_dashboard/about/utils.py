import socket


def check_service(server, port, ip_type=socket.SOCK_STREAM):
    sock = socket.socket(socket.AF_INET, ip_type)
    result = sock.connect_ex((server, port))
    sock.close()
    return result == 0

import os
import sys
import json
from math import pow
# import stripe
sys.path.append('src/api')  # noqa
from notify.app import *  # noqa
# from shared.python.models import UserModel  # noqa

keeper = Cryptographer(
    'password'.encode('UTF-8'), 'salt'.encode('UTF-8'))


class TestCryptographer:
    def test_init(self):
        assert hasattr(keeper, 'f')

    def test_encrypt_and_decrypt(self):
        ciphertext = keeper.encrypt('secret'.encode('UTF-8'))
        plaintext = keeper.decrypt(ciphertext).decode('UTF-8')
        assert plaintext == 'secret'


class TestProcessor:
    def test_run(self):
        # processor = Processor(lambda x, y: x ** y, 2)
        processor = Processor(pow, 2)
        results = processor.run(list(range(0, 5)))
        assert results == [0, 1, 4, 9, 16]

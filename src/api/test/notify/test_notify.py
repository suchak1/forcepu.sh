import os
import sys
import json
# import stripe
sys.path.append('src/api')  # noqa
from notify.app import *  # noqa
# from shared.python.models import UserModel  # noqa


class TestCryptographer:
    def test_init(self):
        self.keeper = Cryptographer(
            'password'.encode('UTF-8'), 'salt'.encode('UTF-8'))
        assert hasattr(self.keeper, 'f')

    def test_encrypt_and_decrypt(self):
        ciphertext = self.keeper.encrypt('secret'.encode('UTF-8'))
        plaintext = self.keeper.decrypt(ciphertext).decode('UTF-8')
        assert plaintext == 'secret'


class TestProcessor:
    self.processor = Processor(lambda x, y: x ** y, 2)

    def test_run(self):
        results = self.processor.run(list(range(5)))

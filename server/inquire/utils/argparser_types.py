'''
This file contains a single function for error checking argument parser types.

Authors: Alec Springel
Group Name: 5 Bits in a Byte

Last Modified Date: 03/12/2021
'''


def str2bool(v):
    if isinstance(v, bool):
        return v
    if v.lower() in ('yes', 'true', 't', 'y', '1'):
        return True
    elif v.lower() in ('no', 'false', 'f', 'n', '0'):
        return False
    else:
        raise argparse.ArgumentTypeError('Boolean value expected.')

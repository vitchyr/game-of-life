import argparse
import json
import numpy as np

DEFAULT_CSV_FILE = "data/example0.csv"
DEFAULT_JS_FILE = "data.js"
NETS_TO_WIRE_NAMES_FILES = "nets_to_wire_names.csv"
VDD = 1.2 # Volts

def main():
    parser = argparse.ArgumentParser(
        description="Train a deep controller on Toyworld.")
    parser.add_argument(
            "--csv_file",
            help="Path to CSV file.",
            default=DEFAULT_CSV_FILE)
    parser.add_argument(
            "--js_file",
            help="Path to .js file.",
            default=DEFAULT_JS_FILE)
    args = parser.parse_args()
    csv_file = args.csv_file
    js_file = args.js_file

    mapping_matrix = get_mapping_matrix(csv_file)
    raw_array = np.genfromtxt(csv_file, delimiter=',', skip_header=1)
    js_string = get_save_str_from_raw_array(raw_array, mapping_matrix)
    save_str(js_file, js_string)

def get_mapping_matrix(csv_file):
    """
    The original array is a bunch of columns. Their position on the actual board
    is not cleanly mapped.

    This function returns a matrix M such that:

    M[x][y] = column in the original array of the (x, y) position on the board
    """
    raw_nets_to_wire_names_data = np.genfromtxt(
            NETS_TO_WIRE_NAMES_FILES,
            delimiter=',',
            skip_header=1,
            dtype=str)
    raw_headers = np.genfromtxt(csv_file, delimiter=',', max_rows=1, dtype=str)
    return get_mapping_matrix_from_raw_data(
            raw_nets_to_wire_names_data,
            raw_headers)

def get_mapping_matrix_from_raw_data(nets_to_wire, raw_headers):
    xy_to_net = get_xy_to_net_dict(nets_to_wire)
    net_to_colm = get_net_to_colm(raw_headers)

    mapping_matrix = np.zeros((8, 8), dtype=int)
    for x in range(8):
        for y in range(8):
            net = xy_to_net[(x, y)]
            mapping_matrix[x, y] = net_to_colm[net]

    return mapping_matrix

def get_xy_to_net_dict(nets_to_wire):
    return dict(((int(x), int(y)), net) for x, y, net in nets_to_wire)

def get_net_to_colm(raw_headers):
    def clean_header(h):
        net = h.split(' ')[0]
        if net[0] == '/':
            net = net[1:]
        return net
    nets = [clean_header(h) for h in raw_headers]
    return dict((net, i) for i, net in enumerate(nets))

def get_save_str_from_raw_array(raw_array, mapping_matrix):
    array = threshold_array(raw_array)
    array = rearrange_array(array, mapping_matrix)
    return get_save_string_from_clean_array(array)

def rearrange_array(array, mapping_matrix):
    """Convert 64xn to 8x8xn by using the mapping matrix."""
    simulation_length = array.shape[0]
    new_array = np.zeros((simulation_length, 8, 8), dtype=int)
    for y in range(8):
        for x in range(8):
            i = mapping_matrix[x, y]
            new_array[:, y, x] = array[:, i]
    return flip_array_vertically(new_array)

def flip_array_vertically(array):
    return array[:, ::-1, :]

def threshold_array(array):
    bool_array = array >= (VDD/2)
    return bool_array.astype(int)

def get_save_string_from_clean_array(array):
    lst_array = array.tolist()
    json_str = json.dumps(lst_array)
    return "data = '{0}';".format(json_str)

def save_str(fname, string):
    with open(fname, 'w') as f:
        f.write(string)
    print("Results saved to '{0}'".format(fname))

if __name__ == '__main__':
    main()

import argparse
import json
import numpy as np

DEFAULT_CSV_FILE = "data/example0.csv"
DEFAULT_JS_FILE = "data.js"
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

    raw_array = np.genfromtxt(csv_file, delimiter=',', skip_header=1)
    js_string = get_save_str_from_raw_array(raw_array)
    save_str(js_file, js_string)

def get_save_str_from_raw_array(raw_array):
    array = remove_extra_column(raw_array)
    array = threshold_array(array)
    array = reshape_array(array)
    return get_save_string_from_clean_array(array)

def remove_extra_column(array):
    """Skip every other column, starting after the first one."""
    return array[:, 1::2]

def reshape_array(array):
    """Convert 64xn to 8x8xn."""
    simulation_length = int(array.size / 64)
    return np.reshape(array, (simulation_length, 8, 8))

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

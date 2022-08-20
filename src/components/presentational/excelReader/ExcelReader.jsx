import React, { Component } from 'react';
import * as XLSX from 'xlsx';
import UploadModal from '../uploadModal/UploadModal';
import './ExcelReader.scss';
const make_cols = (refstr) => {
  let o = [],
    C = XLSX.utils.decode_range(refstr).e.c + 1;
  for (var i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i };
  return o;
};
const SheetJSFT = [
  'xlsx',
  'xlsb',
  'xlsm',
  'xls',
  'xml',
  'csv',
  'txt',
  'ods',
  'fods',
  'uos',
  'sylk',
  'dif',
  'dbf',
  'prn',
  'qpw',
  '123',
  'wb*',
  'wq*',
  'html',
  'htm'
]
  .map(function (x) {
    return '.' + x;
  })
  .join(',');

class ExcelReader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: {},
      data: [],
      cols: [],
      open: false,
      status: '',
      isLoading: false
    };
    this.handleFile = this.handleFile.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const files = e.target.files;
    if (files && files[0]) {
      this.setState({ file: files[0] }, () => {
        this.handleFile(this.state.file);
      });
    }
  }

  handleFile(Ufile) {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e) => {
      console.log("Entered here2")
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws);
      console.log(data ,"data hereee");
      const formattedData = data.map((entry)=>({...entry,CompanyName : entry?.CompanyName.normalize("NFD").replace(/[\u0300-\u036f]/g, "")}))
      /* Update state */
      this.setState(
        { data: data, cols: make_cols(ws['!ref']), open: true, status: 'active', isLoading: true },
      );
      this.props
        .addOrganizations(formattedData)
        .unwrap()
        .then((resp) => {
          this.setState({ status: 'success' });
        })
        .catch((err) => {
          this.setState({ status: 'exception' });
          console.log(err);
        })
        .finally(() => {
          this.setState({ isLoading: false ,  data : [] , cols : [] , file  :{}});
        });
    };

    if (rABS) {
      reader.readAsBinaryString(Ufile);
    } else {
      reader.readAsArrayBuffer(Ufile);
    }
  }

  render() {
    return (
      <>
        <UploadModal
          isModalVisible={this.state.open}
          close={() => this.setState({ open: false })}
          status={this.state.status}
          isLoading={this.state.isLoading}
        />
        <div>
          <input
            type="file"
            className="custom-file-input"
            id="file"
            accept={SheetJSFT}
            key= {this.state.file}
            onChange={this.handleChange}
          />
        </div>
      </>
    );
  }
}

export default ExcelReader;

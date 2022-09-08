import React, {useCallback, useMemo} from 'react'
import {useDropzone} from 'react-dropzone'
const baseStyle = {
    marginTop:'10px',
    marginBottom:'10px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#343535',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const focusedStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

function AddPdf() {
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone(
        {useFsAccessApi: false,maxFiles:1,accept: { "application/pdf": [] }
    });

    const files = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));
    const style = {
        ...baseStyle,
    }

    return (

        <section className="container"><aside>

            <ul>{files}</ul>
        </aside>
            <div {...getRootProps({style})}>
                <input {...getInputProps()} />
                <p>Arrastre o toque para seleccionar una imagen</p>
            </div>

        </section>

    );
}

export  default AddPdf;
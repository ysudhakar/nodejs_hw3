import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { Field, reduxForm, getFormValues } from 'redux-form';
import { connect, useSelector, useDispatch } from 'react-redux';

import Input from '../../common/Input';
import trim from '../../../utils/trim';
import { editLoad } from '../../../store/actions';
import * as api from '../../../utils/apiRequest';

let Form = ({ invalid, submitting, handleClose, load }) => {
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const formValues = useSelector((state) => getFormValues('editLoad')(state));

    const createRequest = (load) => {
        api.requestWithToken('/loads', 'PUT', load)
            .then((res) => {
                if (res.status !== 200) {
                    setError(true);
                } else {
                    setError(false);
                }
                return res.json();
            })
            .then((res) => {
                if (error) {
                    setMessage(res.status);
                } else {
                    dispatch(editLoad(load));
                    handleClose();
                }
            })
            .catch((err) => {
                setError(err);
                console.error(err);
            });
    };

    const handleCreate = (e) => {
        e.preventDefault();
        const _load = {
            _id: load._id,
            name: formValues.name,
            payload: formValues.payload,
            dimensions: {
                width: formValues.width,
                height: formValues.height,
                length: formValues.length,
            },
        };

        createRequest(_load);
    };

    return (
        <form className="dialog-form" onSubmit={handleCreate}>
            <div className="flexed-row">
                <Field component={Input}
                    name="name"
                    type="text"
                    label="Load name:"
                    placeholder="Please enter"
                />
            </div>
            <div className="flexed-row">
                <div className="half-column">
                    <Field component={Input}
                        name="width"
                        type="number"
                        label="Width: cm"
                        placeholder="Please enter"
                    />
                </div>
                <div className="half-column">
                    <Field component={Input}
                        name="height"
                        type="number"
                        label="Height: cm"
                        placeholder="Please enter"
                    />
                </div>
            </div>
            <div className="flexed-row">
                <div className="half-column">
                    <Field component={Input}
                        name="length"
                        type="number"
                        label="Length: cm"
                        placeholder="Please enter"
                    />
                </div>
                <div className="half-column">
                    <Field component={Input}
                        name="payload"
                        type="number"
                        label="Payload: kg"
                        placeholder="Please enter"
                    />
                </div>
            </div>
            {error ? <p className="error">{message}</p> : null}
            <div className="dialog-action">
                <Button
                    color="secondary"
                    variant="contained"
                    type="submit"
                    disabled={invalid|| submitting}
                >Save</Button>
            </div>
        </form>
    );
};

function validate(_values) {
    const values = trim(_values);
    const errors = {};

    if (!values.name) {
        errors.name='Load Name field cannot be blank';
    }
    if (!values.width) {
        errors.width='Width form field cannot be blank';
    } else if (values.width > 700) {
        errors.width='Width can not be bigger then 700 cm.';
    }

    if (!values.height) {
        errors.height = 'Height field cannot be blank';
    } else if (values.height > 700) {
        errors.height='Height can not be bigger then 700 cm.';
    }

    if (!values.length) {
        errors.length = 'Length field cannot be blank';
    } else if (values.length > 700) {
        errors.length='Length can not be bigger then 700 cm.';
    }

    if (!values.payload) {
        errors.payload = 'Payload field cannot be blank';
    } else if (values.payload > 4000) {
        errors.payload='Length can not be bigger then 4000 kg.';
    }

    return errors;
}

Form = reduxForm({
    form: 'editLoad',
    validate,
})(Form);


export default connect((state) => ({
    values: getFormValues('editLoad')(state),
}))(Form);



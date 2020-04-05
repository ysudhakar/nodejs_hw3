import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { useSelector, useDispatch } from 'react-redux';
import * as api from '../../utils/apiRequest';
import { getServerTrucks } from '../../store/actions';

import AppBar from '../common/AppBar';
import TruckItem from './TruckItem';
import AddTruckDialog from './AddTruckDialog';

const Trucks = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.userInfo);
    const storeTrucks = useSelector((state) => state.trucks);

    const [createDialog, setCreateDialog] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [trucks, setTrucks] = useState([]);

    const handleCreate = () => {
        setCreateDialog(!createDialog);
    };

    async function fetchData() {
        const res = await api.requestWithToken('/trucks', 'GET');
        res
            .json()
            .then((res) => {
                dispatch(getServerTrucks(res.trucks));
                setLoaded(true);
            })
            .catch((err) => setError(err));
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (storeTrucks.trucks.length) {
            setTrucks(storeTrucks.trucks);
        }
    }, [storeTrucks]);

    return (
        <div className="root">
            <AppBar
                title={loaded ? user.role : 'Profile'}
            />
            <div className="container">
                <div className="container-fluid">
                    <div className="paper">
                        <div className="title-row">
                            <h1 className="title">Trucks</h1>
                            <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                onClick={handleCreate}
                            >Add Truck</Button>
                        </div>
                        <ul className="list">
                            {
                                loaded && trucks.length ?
                                    trucks.map((item, i) => {
                                        return (
                                            <TruckItem key={i} truck={item}/>
                                        );
                                    }) :
                                    <li>Trucks not found.</li>
                            }
                        </ul>
                        {error ? <p>{error}</p> : null}
                    </div>
                </div>
            </div>
            <AddTruckDialog
                open={createDialog}
                handleClose={handleCreate}
            />
        </div>
    );
};

export default Trucks;


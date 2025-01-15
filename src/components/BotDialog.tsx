import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ChangeEvent, SyntheticEvent, useState } from 'react';
import { FormControlLabel, FormGroup, Radio, RadioGroup, Switch, Tooltip } from '@mui/material';

export default function BotDialog({botEnabled, setBotEnabled}: {botEnabled: boolean, setBotEnabled: (v: boolean) => void}) {
    const [openToEnable, setOpenToEnable] = useState(false);
    const [openToDisable, setOpenToDisable] = useState(false);
    const [useDiscord, setUseDiscord] = useState(true);
    const [useEmail, setUseEmail] = useState(false);
    const [useTelegram, setUseTelegram] = useState(false);
    const [options, setOptions] = useState<Array<string> | null>(null);
    const [methodSubscribe, setMethodSubscribe] = useState<string | null>(null);

    const handleClose = () => {
        setOpenToEnable(false);
        setOpenToDisable(false);
    };

    const handleMethodSubscribe = (_: ChangeEvent<HTMLInputElement>, v: string) => {
        setMethodSubscribe(v);
    }

    const handleBotSwitch = (_: SyntheticEvent, v: boolean) => {
        // if (v)
        setOpenToEnable(true);
        // else
            // setOpenToDisable(true);
        setBotEnabled(v);
    }

    return (
        <>
            <FormGroup>
                <Tooltip title="Subscribe to BeuTMSBot v3 to receive notification when there is an update in grades table via Discord, E-Mail">
                    <FormControlLabel control={<Switch />} checked={botEnabled} onChange={handleBotSwitch} label="BeuTMSBot v3" />
                </Tooltip>
            </FormGroup>
            <Dialog
                open={openToEnable}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries((formData as any).entries());
                        const email = formJson.email;
                        console.log(email);
                        handleClose();
                    },
                }}
            >
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please select a subscribing method and fill out the form. We
                        will send updates occasionally.
                    </DialogContentText>
                        <RadioGroup
                            // ref={radioGroupRef}
                            aria-label="ringtone"
                            name="ringtone"
                            value={methodSubscribe}
                            onChange={handleMethodSubscribe}
                        >
                        {options?.map((o: string) => (
                            <FormControlLabel
                            value={o}
                            key={o}
                            control={<Radio />}
                            label={o}
                            />
                        ))}
                        </RadioGroup>
                    {
                        useEmail &&
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="name"
                            name="email"
                            label="Email Address"
                            type="email"
                            fullWidth
                            variant="standard"
                        />
                    }
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Subscribe</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openToDisable}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries((formData as any).entries());
                        const email = formJson.email;
                        console.log(email);
                        handleClose();
                    },
                }}
            >
                <DialogTitle>Unsubscribe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Unsubscribe</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
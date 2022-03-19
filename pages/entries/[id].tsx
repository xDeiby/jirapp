import React, {
  ChangeEvent,
  SyntheticEvent,
  useContext,
  useMemo,
  useState,
} from "react";
import { GetServerSideProps, NextPage } from "next";
import { Layout } from "../../components/layouts";
import {
  Button,
  capitalize,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { DeleteOutlined, SaveOutlined } from "@mui/icons-material";
import { Entry, EntryStatus } from "../../interfaces";
import { dbEntries } from "../../database";
import { EntriesContext } from "../../context/entries";

interface Props {
  entry: Entry;
}

const validStatus: EntryStatus[] = ["pending", "in-progress", "finished"];

const EntryPage: NextPage<Props> = ({ entry }) => {
  const [inputValue, setInputValue] = useState(entry.description);
  const [status, setStatus] = useState<EntryStatus>(entry.status);
  const [touched, setTouched] = useState(false);

  const { updateEntry } = useContext(EntriesContext);

  const isNotValid = useMemo(
    () => inputValue.length === 0 && touched,
    [inputValue, touched]
  );

  const onChangeTextField = (e: ChangeEvent<HTMLInputElement>) =>
    setInputValue(e.target.value);

  const onStatusChanged = (e: SyntheticEvent<Element, Event>) =>
    setStatus((e.target as any).value);

  const onSave = () => {
    updateEntry({ ...entry, description: inputValue, status });
  };

  return (
    <Layout title={inputValue.substring(0, 20) + "..."}>
      <Grid container justifyContent={"center"} sx={{ marginTop: 2 }}>
        <Grid item xs={12} sm={8} md={6}>
          <Card>
            <CardHeader
              title={`Entrada: ${inputValue}`}
              subheader={`Creada hace ${entry.createdAt} minutos`}
            />
            <CardContent>
              <TextField
                sx={{ marginTop: 2, marginBottom: 1 }}
                placeholder="Nueva Entrada"
                autoFocus
                multiline
                fullWidth
                label="Nueva entrada"
                onChange={onChangeTextField}
                value={inputValue}
                helperText={isNotValid && "Ingrese un valor"}
                onBlur={() => setTouched(true)}
                error={isNotValid}
              />

              <FormControl>
                <FormLabel>Estado:</FormLabel>
                <RadioGroup row>
                  {validStatus.map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      checked={option === status}
                      control={<Radio />}
                      label={capitalize(option)}
                      onChange={onStatusChanged}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </CardContent>

            <CardActions>
              <Button
                variant="contained"
                fullWidth
                startIcon={<SaveOutlined />}
                onClick={onSave}
                disabled={inputValue.length === 0}
              >
                Save
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <IconButton
        sx={{
          position: "fixed",
          bottom: 30,
          right: 30,
          backgroundColor: "red",
        }}
      >
        <DeleteOutlined />
      </IconButton>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<
  Props,
  { id: string }
> = async ({ params }) => {
  const entry = await dbEntries.getEntryById(params?.id ?? "");

  if (!entry) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: { entry },
  };
};

export default EntryPage;

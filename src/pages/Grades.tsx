import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Skeleton,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import BotDialog from "../components/BotDialog";
import { api, checkResponseStatus } from "../utils/Api";
import GradesTable from "../components/GradesTable";
import { GradesJson, GradeEntry } from "../utils/Interfaces";
import { createFetchCached } from "../features/FetchCached";
import { useAuth } from "../utils/Auth";
import { createFetchWithAuth } from "../features/FetchWithAuth";
import { t } from "i18next";

export default function Grades() {
  const { logout } = useAuth();
  const [isAll, setIsAll] = useState(false);
  const [semester, setSemester] = useState("1");
  const [oldScale, setOldScale] = useState(false);
  const [calcGrade, setCalcGrade] = useState(true);
  const [roundGrade, setRoundGrade] = useState(false);
  const [act3Enabled, setAct3Enabled] = useState(false);
  const [ssAvaliable, setSsAvaliable] = useState(false);
  const [gradeTLoading, setGradeTLoading] = useState(true);
  const [gradesLoading, setGradesLoading] = useState(true);
  const [doIwAsm, setDoIwAsm] = useState(false);
  const [iwAsm, setIwAsm] = useState("10");
  const [year, setYear] = useState<string | null>(null);
  const [gradesT, setGradesT] = useState<GradesJson | undefined>(undefined);
  const [options, setOptions] = useState<{ [year: string]: boolean }>({});
  const [calcAnchorEl, setCalcAnchorEl] = useState<null | HTMLElement>(null);
  const fetchCached = createFetchCached(logout);
  const fetch = createFetchWithAuth(logout);

  const getGrades = async () => {
    await fetchCached(`${api}/resource/grades`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        checkResponseStatus(response);
        return response.json();
      })
      .catch((e) => {
        console.error(e);
      })
      .then((json) => {
        const options: { [year: string]: boolean } = {};
        if (json.canRequestAll) options["ALL"] = true;
        json.entries.forEach((o: { year: string; semester: number }) => {
          if (!options[o.year]) options[o.year] = o.semester === 2;
        });
        const offset = options["ALL"] ? 2 : 1;
        const keys = Object.keys(options);
        setYear(keys[keys.length - offset]);
        setSemester(options[keys[keys.length - offset]] ? "2" : "1");
        setOptions(options);
        setGradesLoading(false);
      });
  };

  const getGradesTable = async (year: string, semester: string) => {
    await fetch(
      year === "ALL"
        ? `${api}/resource/grades/all`
        : `${api}/resource/grades/${year}/${semester}`,
      {
        method: "GET",
        credentials: "include",
      },
    )
      .then((response) => {
        checkResponseStatus(response);
        return response.json();
      })
      .catch((e) => {
        console.error(e);
      })
      .then((json) => {
        const testEntry = Object.values(json)[0] as GradeEntry;
        setAct3Enabled(testEntry.act3 !== undefined);
        setGradesT(json);
        setGradeTLoading(false);
      });
  };

  const handleSemesterBox = (_: MouseEvent<HTMLElement>, v: string) => {
    if (v !== null) {
      setSemester(v);
      setGradeTLoading(true);
    }
  };

  const handleYearBox = (_: SyntheticEvent, v: string) => {
    setYear(v);
    setGradeTLoading(true);
  };

  const handleScaleCheck = (_: ChangeEvent<HTMLInputElement>, v: boolean) => {
    setRoundGrade(false);
    setOldScale(v);
  };

  const handleRoundCheck = (_: ChangeEvent<HTMLInputElement>, v: boolean) => {
    setRoundGrade(v);
  };

  const handleCalcCheck = (_: ChangeEvent<HTMLInputElement>, v: boolean) => {
    setCalcAnchorEl(null);
    setCalcGrade(v);
  };

  const handleAct3Check = (_: ChangeEvent<HTMLInputElement>, v: boolean) => {
    setAct3Enabled(v);
  };

  const handleDoIwAsm = (_: ChangeEvent<HTMLInputElement>, v: boolean) => {
    setDoIwAsm(v);
  };

  const handleIwAsm = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    let input = e.target.value;

    if (!/^\d*$/.test(input)) return;

    if (input.length > 1 && input.startsWith("0")) {
      input = input.replace(/^0+/, "");
    }

    if (Number(input) <= 10) setIwAsm(input);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    let current = parseInt(iwAsm || "0", 10);

    if (e.key === "ArrowUp") {
      current = Math.min(current + 1, 10);
      setIwAsm(String(current));
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      current = Math.max(current - 1, 0);
      setIwAsm(String(current));
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (gradesT === undefined) getGrades();
  }, []);

  useEffect(() => {
    if (year !== null && semester !== null) {
      if (year === "ALL") {
        setIsAll(true);
      } else setIsAll(false);
      setSsAvaliable(options[year]);
      if (semester === "2" && !options[year]) setSemester("1");
      else {
        getGradesTable(year, semester);
      }
    }
  }, [year, semester]);

  return (
    <Stack p="0.05rem" gap="0.1rem">
      <Stack
        rowGap="0.5rem"
        columnGap="1rem"
        m="1rem"
        flexDirection="row"
        alignItems="center"
        flexWrap="wrap"
      >
        {gradesLoading ? (
          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{
              width: "6rem",
              height: "3.25rem",
            }}
          />
        ) : (
          <Autocomplete
            disablePortal
            options={Object.keys(options)}
            sx={{ width: "6rem" }}
            onChange={handleYearBox}
            value={year || ""}
            disableClearable
            renderInput={(params) => <TextField {...params} label="Year" />}
          />
        )}
        {gradesLoading ? (
          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{
              width: "4rem",
              height: "3.25rem",
            }}
          />
        ) : (
          !isAll && (
            <ToggleButtonGroup
              color="primary"
              value={semester}
              onChange={handleSemesterBox}
              exclusive
              aria-label="semester number"
              sx={{
                m: "0.2rem"
              }}
            >
              <ToggleButton value="1" aria-label="first">
                1
              </ToggleButton>
              <ToggleButton
                value="2"
                aria-label="second"
                disabled={!ssAvaliable}
              >
                2
              </ToggleButton>
            </ToggleButtonGroup>
          )
        )}
        <BotDialog />
        <FormGroup>
          <Tooltip title={t("gradeOld")}>
            <FormControlLabel
              control={
                <Checkbox checked={oldScale} onChange={handleScaleCheck} />
              }
              label={t("gradeOldLabel")}
            />
          </Tooltip>
        </FormGroup>
        <FormGroup>
          <Tooltip title={t("gradeRound")}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={roundGrade}
                  onChange={handleRoundCheck}
                  disabled={oldScale}
                />
              }
              label={t("gradeRoundLabel")}
            />
          </Tooltip>
        </FormGroup>
        <FormGroup>
          <Tooltip title={t("gradeCalc")}>
            <FormControlLabel
              control={
                <Checkbox checked={calcGrade} onChange={handleCalcCheck} />
              }
              label={t("gradeCalcLabel")}
            />
          </Tooltip>
        </FormGroup>
        <FormGroup>
          <Tooltip title={t("gradeAct3")}>
            <FormControlLabel
              control={
                <Checkbox checked={act3Enabled} onChange={handleAct3Check} />
              }
              label={t("gradeAct3Label")}
            />
          </Tooltip>
        </FormGroup>
        <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
          <Tooltip title={t("gradeAssumeIw")}>
            <FormControlLabel
              control={<Checkbox checked={doIwAsm} onChange={handleDoIwAsm} />}
              label={t("gradeAssumeIwLabel")}
            />
          </Tooltip>
          {doIwAsm && (
            <TextField
              id="input-iwasm"
              type="number"
              placeholder="10"
              value={iwAsm}
              onChange={handleIwAsm}
              onKeyDown={handleKeyDown}
              sx={{ width: "3rem" }}
            />
          )}
        </FormGroup>
      </Stack>
      <GradesTable
        doIwAsm={doIwAsm}
        iwAsm={iwAsm}
        gradesT={gradesT}
        gradeTLoading={gradeTLoading}
        oldScale={oldScale}
        calcGrade={calcGrade}
        roundGrade={roundGrade}
        act3Enabled={act3Enabled}
        calcAnchorEl={calcAnchorEl}
        setCalcAnchorEl={setCalcAnchorEl}
      />
    </Stack>
  );
}

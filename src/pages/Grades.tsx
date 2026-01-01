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
import { GradeEntry, GradesFilters } from "../utils/Interfaces";
import { createFetchCached } from "../features/FetchCached";
import { useAuth } from "../utils/Auth";
import { createFetchWithAuth } from "../features/FetchWithAuth";
import { t } from "i18next";

export default function Grades() {
  const { logout } = useAuth();
  const [f, setF] = useState<GradesFilters>({
    isAll: false,
    semester: "1",
    oldScale: false,
    calcGrade: true,
    roundGrade: false,
    act3Enabled: false,
    ssAvaliable: false,
    gradesTLoading: true,
    gradesLoading: true,
    doIwAsm: false,
    iwAsm: "10",
    year: null,
    gradesT: undefined,
    options: {}
  })
  const [calcAnchorEl, setCalcAnchorEl] = useState<null | HTMLElement>(null);
  const fetchCached = createFetchCached(logout);
  const fetch = createFetchWithAuth(logout);

  const updateF = <K extends keyof GradesFilters>(
    key: K,
    value: GradesFilters[K]
  ) => {
    setF(prev => ({
      ...prev,
      [key]: value,
    }));
  };

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
        updateF("year", keys[keys.length - offset]);
        updateF("semester", options[keys[keys.length - offset]] ? "2" : "1");
        updateF("options", options);
        updateF("gradesLoading", false);
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
        updateF("act3Enabled", testEntry.act3 !== undefined);
        updateF("gradesT", json);
        updateF("gradesTLoading", false);
      });
  };

  const handleSemesterBox = (_: MouseEvent<HTMLElement>, v: "1" | "2") => {
    if (v !== null) {
      updateF("semester", v);
      updateF("gradesTLoading", true);
    }
  };

  const handleYearBox = (_: SyntheticEvent, v: string) => {
    updateF("year", v);
    updateF("gradesTLoading", true);
  };

  const handleScaleCheck = (_: ChangeEvent<HTMLInputElement>, v: boolean) => {
    updateF("roundGrade", false);
    updateF("oldScale", v);
  };

  const handleRoundCheck = (_: ChangeEvent<HTMLInputElement>, v: boolean) => {
    updateF("roundGrade", v);
  };

  const handleCalcCheck = (_: ChangeEvent<HTMLInputElement>, v: boolean) => {
    setCalcAnchorEl(null);
    updateF("calcGrade", v);
  };

  const handleAct3Check = (_: ChangeEvent<HTMLInputElement>, v: boolean) => {
    updateF("act3Enabled", v);
  };

  const handleDoIwAsm = (_: ChangeEvent<HTMLInputElement>, v: boolean) => {
    updateF("doIwAsm", v);
  };

  const handleIwAsm = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    let input = e.target.value;

    if (!/^\d*$/.test(input)) return;

    if (input.length > 1 && input.startsWith("0")) {
      input = input.replace(/^0+/, "");
    }

    if (Number(input) <= 10) updateF("iwAsm", input);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    let current = parseInt(f.iwAsm || "0", 10);

    if (e.key === "ArrowUp") {
      current = Math.min(current + 1, 10);
      updateF("iwAsm", String(current));
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      current = Math.max(current - 1, 0);
      updateF("iwAsm", String(current));
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (f["gradesT"] === undefined) getGrades();
  }, []);

  useEffect(() => {
    if (f.year !== null && f.semester !== null) {
      if (f.year === "ALL") {
        updateF("isAll", true);
      } else updateF("isAll", false);
      updateF("ssAvaliable", f.options[f.year]);
      if (f.semester === "2" && !f.options[f.year]) updateF("semester", "1");
      else {
        getGradesTable(f.year, f.semester);
      }
    }
  }, [f.year, f.semester]);

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
        {f.gradesLoading ? (
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
            options={Object.keys(f.options)}
            sx={{ width: "6rem" }}
            onChange={handleYearBox}
            value={f.year || ""}
            disableClearable
            renderInput={(params) => <TextField {...params} label="Year" />}
          />
        )}
        {f.gradesLoading ? (
          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{
              width: "4rem",
              height: "3.25rem",
            }}
          />
        ) : (
          !f.isAll && (
            <ToggleButtonGroup
              color="primary"
              value={f.semester}
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
                disabled={!f.ssAvaliable}
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
                <Checkbox checked={f.oldScale} onChange={handleScaleCheck} />
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
                  checked={f.roundGrade}
                  onChange={handleRoundCheck}
                  disabled={f.oldScale}
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
                <Checkbox checked={f.calcGrade} onChange={handleCalcCheck} />
              }
              label={t("gradeCalcLabel")}
            />
          </Tooltip>
        </FormGroup>
        <FormGroup>
          <Tooltip title={t("gradeAct3")}>
            <FormControlLabel
              control={
                <Checkbox checked={f.act3Enabled} onChange={handleAct3Check} />
              }
              label={t("gradeAct3Label")}
            />
          </Tooltip>
        </FormGroup>
        <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
          <Tooltip title={t("gradeAssumeIw")}>
            <FormControlLabel
              control={<Checkbox checked={f.doIwAsm} onChange={handleDoIwAsm} />}
              label={t("gradeAssumeIwLabel")}
            />
          </Tooltip>
          {f.doIwAsm && (
            <TextField
              id="input-iwasm"
              type="number"
              placeholder="10"
              value={f.iwAsm}
              onChange={handleIwAsm}
              onKeyDown={handleKeyDown}
              sx={{ width: "3rem" }}
            />
          )}
        </FormGroup>
      </Stack>
      <GradesTable
        f={f}
        calcAnchorEl={calcAnchorEl}
        setCalcAnchorEl={setCalcAnchorEl}
      />
    </Stack>
  );
}

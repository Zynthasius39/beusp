import {
  Autocomplete,
  Skeleton,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  MouseEvent,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import BotDialog from "../components/BotDialog";
import { api, checkResponseStatus } from "../utils/Api";
import GradesTable, { GradeEntry } from "../components/GradesTable";
import { createFetchCached } from "../features/FetchCached";
import { useAuth } from "../utils/Auth";
import { createFetchWithAuth } from "../features/FetchWithAuth";
import { GradesFilter, GradesFilters } from "../components/GradesFilter";
import { useTranslation } from "react-i18next";

export default function Grades() {
  const { t } = useTranslation();
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
        sx={{
          p: "0.4rem",
          m: "1rem",
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          "& .MuiStack-root": {
            gap: "1rem",
            flexDirection: "row"
          }
        }}
      >
        <Stack>
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
              sx={{ width: "6.4rem" }}
              onChange={handleYearBox}
              value={f.year || ""}
              disableClearable
              renderInput={(params) => <TextField {...params} label={t("courseYear")} />}
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
                  m: "0.2rem",
                  "& .MuiToggleButton-root": {
                    paddingInline: "1.2rem",
                  }
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
        </Stack>
        <Stack direction="row">
          <BotDialog />
          <GradesFilter f={f} updateF={updateF} setCalcAnchorEl={setCalcAnchorEl} />
        </Stack>
      </Stack>
      <GradesTable
        f={f}
        calcAnchorEl={calcAnchorEl}
        setCalcAnchorEl={setCalcAnchorEl}
      />
    </Stack>
  );
}

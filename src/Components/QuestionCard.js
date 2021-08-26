import React from "react";
import {
  Paper,
  Grid,
  Typography,
  Link,
  Divider,
  Chip,
  Box,
} from "@material-ui/core";
import { useNavigate } from "@reach/router";

export default function QuestionCard(props) {
  const question = props.question;
  const navigate = useNavigate();
  return (
    <div>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        onClick={() => {
          navigate(`/question/${question._id}`);
        }}
      >
        <Paper style={{ width: "60%", padding: "2%", margin: "3%" }}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h4">{question.title}</Typography>
            </Grid>
            <Grid xs={12} style={{ marginTop: "2%" }}>
              {question.tag.map((x, i) => (
                <Chip style={{ marginLeft: "1%" }} key={i} label={x} />
              ))}
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </div>
  );
}

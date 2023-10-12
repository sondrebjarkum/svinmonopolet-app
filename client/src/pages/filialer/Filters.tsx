import { FormLabel, Switch } from "@chakra-ui/react";
import Filter from "~/components/Base/FiltersBases";
const stiler = [
  "Barleywine",
  "IPA",
  "Lager",
  "Pale Ale",
  "Hvete",
  "Stout",
  "Porter",
];
const Filters = () => {
  return (
    <Filter header={"Filter"}>
      {stiler.map((stil) => (
        <>
          <FormLabel htmlFor={stil} mb="0">
            {stil}
          </FormLabel>
          <Switch id={stil} />
        </>
      ))}
    </Filter>
  );
};

export default Filters;

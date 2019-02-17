import * as commandLineArgs from 'command-line-args';

const OPTION_DEFITIONS = [
  {name: 'serve', alias: 's', type: Boolean}
];

interface OptionDefinitions {
  serve: boolean;
}

const options: OptionDefinitions = commandLineArgs(OPTION_DEFITIONS, {
  partial: true,
  stopAtFirstUnknown: false
});

export {options, OptionDefinitions};

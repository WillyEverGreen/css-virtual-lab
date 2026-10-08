import type { Roster } from '../schemas/roster';

export interface UnassignedMember {
  name: string;
  githubLogin: string;
}

export const DEFAULT_ROSTER: Roster = {
  schemaVersion: 1,
  teams: [
    {
      slug: 'md5',
      members: [
        { name: 'Nicole Dabre', rollNo: 'TBD', githubLogin: 'nicole2006-driven' },
        { name: 'Alciya Dodti', rollNo: 'TBD', githubLogin: 'Alciya-dodti' },
        { name: 'Larissa Dabreo', rollNo: 'TBD', githubLogin: 'Larissaa12' },
        { name: 'Ruth Dmello', rollNo: 'TBD', githubLogin: 'dmelloruth21' },
      ],
    },
    {
      slug: 'sha1',
      members: [
        { name: 'Swar', rollNo: 'TBD', githubLogin: 'SC136' },
        { name: 'Tanush Chavan', rollNo: 'TBD', githubLogin: 'tanushcode' },
        { name: 'Aaron Deniz', rollNo: 'TBD', githubLogin: 'AaronDeniz17' },
        { name: 'Asher', rollNo: 'TBD', githubLogin: 'asher2006' },
      ],
    },
    {
      slug: 'mac',
      members: [
        { name: 'Aarna Chopdekar', rollNo: 'TBD', githubLogin: 'Aarnaaa22' },
        { name: 'Slora Bar', rollNo: 'TBD', githubLogin: 'Slora123' },
        { name: 'Arya Chavan', rollNo: 'TBD', githubLogin: 'ryachavan' },
        { name: 'Cajetan Dsouza', rollNo: 'TBD', githubLogin: 'Cajetan02' },
        { name: 'Shreyas Divekar', rollNo: 'TBD', githubLogin: null },
      ],
    },
    {
      slug: 'hmac',
      members: [
        { name: 'Jadern Crasto', rollNo: 'TBD', githubLogin: 'jadencrasto' },
        { name: 'Wendell Dsouza', rollNo: 'TBD', githubLogin: 'Wendellpy' },
        { name: 'Rohit Ahir', rollNo: 'TBD', githubLogin: null },
      ],
    },
    {
      slug: 'ssl-tls',
      members: [
        { name: 'Jace Jaison', rollNo: 'TBD', githubLogin: 'Jace-4' },
        { name: 'Ahamed Wafiq', rollNo: 'TBD', githubLogin: 'ahamed-wafiq' },
      ],
    },
  ],
};

export const UNASSIGNED_MEMBERS: UnassignedMember[] = [
  { name: 'Crisann Lobo', githubLogin: 'cl-cl-536' },
  { name: 'Niranjan Shanbhag', githubLogin: 'NiranjanS20' },
  { name: 'Nemi Gada', githubLogin: 'NemiGada' },
  { name: 'Eva Gonsalves', githubLogin: 'Eva29120' },
  { name: 'Rahul Kewat', githubLogin: 'Rahul9969' },
  { name: 'Joel Wilson Mulakkal', githubLogin: 'InfiniteSkiller' },
  { name: 'STEWIN MATHIAS', githubLogin: 'stewin16' },
  { name: 'Ephraim T Philip', githubLogin: 'ephraimtphilip77-hash' },
  { name: 'Sherwin Gonsalves', githubLogin: 'SHERV22' },
  { name: 'sakshi', githubLogin: 'sakshi' },
  { name: 'Kamesh Nerpagar', githubLogin: 'kameshnerpagar' },
  { name: 'Sven Tuscano', githubLogin: 'SvenTuscano' },
  { name: 'Arnav Potale', githubLogin: 'arnavpotale' },
  { name: 'Daksh Shetty', githubLogin: 'DakShetty' },
];

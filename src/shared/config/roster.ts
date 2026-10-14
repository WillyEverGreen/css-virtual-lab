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
      ],
    },
    {
      slug: 'hmac',
      members: [
        { name: 'Jadern Crasto', rollNo: 'TBD', githubLogin: 'jadencrasto' },
        { name: 'Wendell Dsouza', rollNo: 'TBD', githubLogin: 'Wendellpy' },
        { name: 'Rohit Ahir', rollNo: 'TBD', githubLogin: 'Rohit-Ahir' },
        { name: 'Shreyas Divekar', rollNo: 'TBD', githubLogin: 'Shreyas-fr' },
      ],
    },
    {
      slug: 'ssl-tls',
      members: [
        { name: 'Jace Jaison', rollNo: 'TBD', githubLogin: 'Jace-4' },
        { name: 'Ahamed Wafiq', rollNo: 'TBD', githubLogin: 'ahamed-wafiq' },
        { name: 'Sai Balkawade', rollNo: 'TBD', githubLogin: 'WillyEverGreen' },
      ],
    },
  ],
};

export const UNASSIGNED_MEMBERS: UnassignedMember[] = [];


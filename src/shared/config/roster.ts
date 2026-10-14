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
        { name: 'Nicole Dabre', rollNo: '10717', githubLogin: 'nicole2006-driven' },
        { name: 'Alciya Dodti', rollNo: '10722', githubLogin: 'Alciya-dodti' },
        { name: 'Larissa Dabreo', rollNo: '10718', githubLogin: 'Larissaa12' },
        { name: 'Ruth Dmello', rollNo: '10721', githubLogin: 'dmelloruth21' },
      ],
    },
    {
      slug: 'sha1',
      members: [
        { name: 'Swar', rollNo: '10713', githubLogin: 'SC136' },
        { name: 'Tanush Chavan', rollNo: '10710', githubLogin: 'tanushcode' },
        { name: 'Aaron Deniz', rollNo: '10719', githubLogin: 'AaronDeniz17' },
        { name: 'Asher', rollNo: '10715', githubLogin: 'asher2006' },
      ],
    },
    {
      slug: 'mac',
      members: [
        { name: 'Aarna Chopdekar', rollNo: '10712', githubLogin: 'Aarnaaa22' },
        { name: 'Slora Bar', rollNo: '10708', githubLogin: 'Slora123' },
        { name: 'Arya Chavan', rollNo: '10709', githubLogin: 'ryachavan' },
        { name: 'Cajetan Dsouza', rollNo: '10723', githubLogin: 'Cajetan02' },
      ],
    },
    {
      slug: 'hmac',
      members: [
        { name: 'Jadern Crasto', rollNo: '10716', githubLogin: 'jadencrasto' },
        { name: 'Wendell Dsouza', rollNo: '10724', githubLogin: 'Wendellpy' },
        { name: 'Rohit Ahir', rollNo: '10706', githubLogin: 'Rohit-Ahir' },
        { name: 'Shreyas Divekar', rollNo: '10720', githubLogin: 'Shreyas-fr' },
      ],
    },
    {
      slug: 'ssl-tls',
      members: [
        { name: 'Jace Jaison', rollNo: '10711', githubLogin: 'Jace-4' },
        { name: 'Ahamed Wafiq', rollNo: '10705', githubLogin: 'ahamed-wafiq' },
        { name: 'Sai Balkawade', rollNo: '10707', githubLogin: 'WillyEverGreen' },
      ],
    },
  ],
};

export const UNASSIGNED_MEMBERS: UnassignedMember[] = [];


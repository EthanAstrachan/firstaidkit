import type { NextApiRequest, NextApiResponse } from 'next'
import { getDB } from './lib/db';
import type { Applicant } from './lib/applicant'

const isValidApplicant = (applicant: Applicant) => {
    if (applicant.name === undefined || applicant.phone === undefined || applicant.phone.length !== 10 || Number.isNaN(Number(applicant.phone))) {
        return false
    }

    return true
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    const applicant = JSON.parse(req.body)
    const db = await getDB();
    if (!isValidApplicant(applicant)) {
        res.status(500).json({message: "Invalid applicant information"})
    } else {
        const response = await db.run('insert into applicant (name, phone) values (?, ?)', 
            applicant.name,
            applicant.phone
        );
        res.status(200).json(response);
    }
    
    db.close();
}

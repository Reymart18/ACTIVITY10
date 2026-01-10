import { Injectable } from '@nestjs/common';

@Injectable()
export class AttendeesService {
  findByEvent(eventId: number) {
    return []; // return array of attendees
  }

  search(eventId: number, query: string) {
    return []; // return filtered results
  }
}

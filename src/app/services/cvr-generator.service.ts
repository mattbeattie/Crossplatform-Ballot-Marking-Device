import { Injectable } from '@angular/core';

import { Election } from './election-model-constructor.service';

@Injectable({
  providedIn: 'root',
})
export class CvrGeneratorService {
  constructor() {}

  // todo: constructing a JSON string like this is brittle, and difficult to extend if you need to make changes or additions to it.
  // further, it's not really possible to see what the shape of the JSON looks like, which prevents us from knowing whether it
  // conforms to any specification unless you run the code and manually confirm.
  // a better implementation would:
  // 1. include an interface for what this JSON object should look like,
  // 2. create a JSON object which conforms to that interface and has all the values necessary
  // 3. use JSON.stringify(cvr) to convert the object to JSON
  createCVR(election: Election) {
    console.log('🚀 ~ file: cvr-generator.service.ts ~ line 19 ~ CvrGeneratorService ~ createCVR ~ election', election);
    //   let output = '';
    //   output += '{ "election" : "big important election title here", "contests": [';
    //   this.election.contests.forEach((element, idx) => {
    //     output += '{"contest":"' + element.contestName + '",';
    //     output += '"contestId":"' + element.contestId + '",';
    //     output += '"contestants": [';
    //     const emptyWriteIns = this.getEmptyWriteIns(element.ballotSelections);
    //     element.ballotSelections.forEach((ballotselection, idx2) => {
    //       const candidateName = ballotselection.getCandidatesString().trim();

    //       if (candidateName !== undefined && candidateName !== 'undefined' && !candidateName.startsWith('Touch here')) {
    //         this.candidateNames.push(candidateName);
    //         output += '{"name":"' + candidateName + '",';
    //         output += '"candidateID":"' + ballotselection.getCandidateId() + '",';
    //         output += '"selected":"' + ballotselection.selected + '"}';
    //         if (idx2 < element.ballotSelections.length - 1 - emptyWriteIns) {
    //           output += ',';
    //         }
    //       }
    //     });
    //     output += ']}';
    //     if (idx < this.election.contests.length - 1) {
    //       output += ',';
    //     } else {
    //       output += ']';
    //     }
    //   });
    //   output += '}';
    //   console.log(output);
  }
}

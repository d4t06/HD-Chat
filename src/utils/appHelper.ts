export const sleep = (time: number) =>
   new Promise<void>((rs) => {
      setTimeout(() => {
         rs();
      }, time);
   });

// export const convertFirestoreTimestampToString = (data) => {
//    return new Date(timeStamp.toDate().getTime()).toLocaleString();
// };

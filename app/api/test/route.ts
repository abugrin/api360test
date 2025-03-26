

export const POST = async (req: Request): Promise<Response> => {
  const requestody = await req.body;
  console.log('Post request recieved');
  console.log(requestody);


  return Response.json('OK');
};

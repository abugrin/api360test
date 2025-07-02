export const POST = async (req: Request): Promise<Response> => {
  //console.log(await req.json());
  console.dir(await req.json(), { depth: null });

  return Response.json('OK');
};



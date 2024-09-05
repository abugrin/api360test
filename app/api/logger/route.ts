export const POST = async (req: Request): Promise<Response> => {
  console.log(await req.json());

  return Response.json('OK');
};



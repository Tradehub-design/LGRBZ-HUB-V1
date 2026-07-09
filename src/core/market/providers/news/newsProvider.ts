export interface NewsArticle{

title:string;

url:string;

published:string;

source:string;

summary:string;

}

export async function companyNews(

ticker:string

):Promise<NewsArticle[]>{

return[];

}

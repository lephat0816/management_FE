import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

type CategoryCardProps = {
    name: string;
    status: string;
    description: string;
    imageUrl: string;
}
export default function CategoryCard({name, status, description, imageUrl}: CategoryCardProps) {
  return (
    <Card sx={{maxWidth:320}}>
        <CardActionArea>
            <CardMedia
                component="img"
                height="140"
                image={imageUrl}
                alt={name}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {status}
                </Typography> 
                <Typography variant="body1" color="text.secondary">
                    {description}
                </Typography> 
            </CardContent>
        </CardActionArea>
    </Card>
  )
}

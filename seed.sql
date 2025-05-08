-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS pairs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  term TEXT NOT NULL,
  match TEXT NOT NULL,
  category TEXT DEFAULT 'general'
);

-- .NET
INSERT INTO pairs (term, match, category) VALUES
('Blazor', 'WebAssembly', 'dotnet'),
('Entity Framework', 'ORM', 'dotnet'),
('ASP.NET', 'Web Development', 'dotnet'),
('TFS', 'Azure DevOps', 'dotnet');

-- Java
INSERT INTO pairs (term, match, category) VALUES
('Spring Boot', 'Java', 'java'),
('Hibernate', 'ORM', 'java'),
('Maven', 'Build Tool', 'java'),
('JVM', 'Java Runtime', 'java');

-- Cloud (AWS & Azure)
INSERT INTO pairs (term, match, category) VALUES
('Lambda', 'AWS', 'cloud'),
('S3', 'Object Storage', 'cloud'),
('Azure Functions', 'Serverless', 'cloud'),
('CloudFormation', 'AWS Infrastructure as Code', 'cloud'),
('Bicep', 'Azure Infrastructure as Code', 'cloud');

-- API
INSERT INTO pairs (term, match, category) VALUES
('GraphQL', 'Query Language', 'api'),
('REST', 'Architectural Style', 'api'),
('SOAP', 'Protocol', 'api'),
('OpenAPI', 'Specification', 'api');

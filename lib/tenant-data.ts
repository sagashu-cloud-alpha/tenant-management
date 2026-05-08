export interface TenantImage {
  name: string
  tag: string
  status: string
  containers: number
  cpu: number
  mem: string
  size: string
  pulled: string
}

export interface TenantService {
  name: string
  type: string
  status: string
  port: string
  uptime: string
  version: string
}

export interface TenantResources {
  cpu: number
  cpuUsed: number
  mem: number
  memUsed: number
  storage: number
  storageUsed: number
  maxImages: number
}

export interface Tenant {
  id: string
  name: string
  subdomain: string
  email: string
  status: string
  plan: string
  region: string
  env: string
  created: string
  billing: string
  description: string
  tags: string[]
  resources: TenantResources
  colorIdx: number
  images: TenantImage[]
  services: TenantService[]
}

export const COLORS = [
  { bg: "rgba(79,142,247,0.15)", color: "#4f8ef7" },
  { bg: "rgba(34,197,94,0.1)", color: "#22c55e" },
  { bg: "rgba(167,139,250,0.1)", color: "#a78bfa" },
  { bg: "rgba(45,212,191,0.1)", color: "#2dd4bf" },
  { bg: "rgba(245,158,11,0.1)", color: "#f59e0b" },
  { bg: "rgba(239,68,68,0.1)", color: "#ef4444" },
]

export const tenants: Tenant[] = [
  {
    id: "tnx-001",
    name: "Acme Corp",
    subdomain: "acme",
    email: "admin@acme.com",
    status: "active",
    plan: "enterprise",
    region: "us-east-1",
    env: "Production",
    created: "2024-01-15",
    billing: "Annual",
    description: "Global enterprise client in fintech sector.",
    tags: ["fintech", "enterprise", "production", "us-region"],
    resources: {
      cpu: 32,
      cpuUsed: 22,
      mem: 128,
      memUsed: 87,
      storage: 1000,
      storageUsed: 650,
      maxImages: 20,
    },
    colorIdx: 0,
    images: [
      { name: "nginx", tag: "1.25-alpine", status: "running", containers: 4, cpu: 12, mem: "256 MB", size: "23 MB", pulled: "2 days ago" },
      { name: "node-api", tag: "18.17.0", status: "running", containers: 8, cpu: 34, mem: "1.2 GB", size: "380 MB", pulled: "5 hours ago" },
      { name: "postgres", tag: "15.4", status: "running", containers: 2, cpu: 18, mem: "2.1 GB", size: "412 MB", pulled: "7 days ago" },
      { name: "redis", tag: "7.2-alpine", status: "running", containers: 2, cpu: 5, mem: "128 MB", size: "16 MB", pulled: "3 days ago" },
      { name: "kafka", tag: "3.6.0", status: "warning", containers: 3, cpu: 45, mem: "3.4 GB", size: "650 MB", pulled: "1 day ago" },
      { name: "elasticsearch", tag: "8.11.0", status: "running", containers: 2, cpu: 28, mem: "4.2 GB", size: "890 MB", pulled: "2 days ago" },
    ],
    services: [
      { name: "API Gateway", type: "Networking", status: "running", port: "8080", uptime: "99.98%", version: "v3.2.1" },
      { name: "Auth Service", type: "Security", status: "running", port: "9000", uptime: "100%", version: "v1.8.4" },
      { name: "PostgreSQL", type: "Database", status: "running", port: "5432", uptime: "99.95%", version: "15.4" },
      { name: "Redis Cache", type: "Cache", status: "running", port: "6379", uptime: "99.99%", version: "7.2" },
      { name: "Kafka Broker", type: "Messaging", status: "warning", port: "9092", uptime: "97.2%", version: "3.6.0" },
      { name: "Elasticsearch", type: "Search", status: "running", port: "9200", uptime: "99.7%", version: "8.11" },
      { name: "S3 Connector", type: "Storage", status: "running", port: "\u2014", uptime: "100%", version: "v2.0" },
      { name: "Grafana", type: "Monitoring", status: "running", port: "3000", uptime: "99.5%", version: "10.2" },
    ],
  },
  {
    id: "tnx-002",
    name: "NovaTech Ltd",
    subdomain: "novatech",
    email: "ops@novatech.io",
    status: "active",
    plan: "pro",
    region: "eu-west-1",
    env: "Production",
    created: "2024-03-08",
    billing: "Monthly",
    description: "B2B SaaS startup in logistics space.",
    tags: ["logistics", "startup", "europe"],
    resources: {
      cpu: 16,
      cpuUsed: 9,
      mem: 64,
      memUsed: 31,
      storage: 500,
      storageUsed: 210,
      maxImages: 10,
    },
    colorIdx: 1,
    images: [
      { name: "react-frontend", tag: "3.1.0", status: "running", containers: 2, cpu: 8, mem: "512 MB", size: "180 MB", pulled: "1 day ago" },
      { name: "go-backend", tag: "1.21", status: "running", containers: 4, cpu: 22, mem: "768 MB", size: "95 MB", pulled: "3 days ago" },
      { name: "mysql", tag: "8.0", status: "running", containers: 1, cpu: 15, mem: "1.8 GB", size: "520 MB", pulled: "6 days ago" },
      { name: "rabbitmq", tag: "3.12", status: "running", containers: 1, cpu: 6, mem: "256 MB", size: "210 MB", pulled: "2 days ago" },
    ],
    services: [
      { name: "Load Balancer", type: "Networking", status: "running", port: "80/443", uptime: "99.9%", version: "HAProxy 2.8" },
      { name: "Go API", type: "Backend", status: "running", port: "8000", uptime: "99.6%", version: "1.21" },
      { name: "MySQL", type: "Database", status: "running", port: "3306", uptime: "99.9%", version: "8.0" },
      { name: "RabbitMQ", type: "Messaging", status: "running", port: "5672", uptime: "99.4%", version: "3.12" },
      { name: "S3 Storage", type: "Storage", status: "running", port: "\u2014", uptime: "100%", version: "v2" },
    ],
  },
  {
    id: "tnx-003",
    name: "HelixAI",
    subdomain: "helixai",
    email: "infra@helixai.com",
    status: "active",
    plan: "enterprise",
    region: "us-west-2",
    env: "Production",
    created: "2024-02-22",
    billing: "Annual",
    description: "AI/ML platform for enterprise data teams.",
    tags: ["ai", "ml", "enterprise", "gpu-enabled"],
    resources: {
      cpu: 64,
      cpuUsed: 51,
      mem: 256,
      memUsed: 198,
      storage: 2000,
      storageUsed: 1340,
      maxImages: 25,
    },
    colorIdx: 2,
    images: [
      { name: "pytorch", tag: "2.1-cuda12", status: "running", containers: 4, cpu: 82, mem: "12 GB", size: "4.1 GB", pulled: "4 hours ago" },
      { name: "jupyter-hub", tag: "4.0.2", status: "running", containers: 6, cpu: 24, mem: "2.4 GB", size: "1.2 GB", pulled: "2 days ago" },
      { name: "mlflow", tag: "2.9.2", status: "running", containers: 2, cpu: 12, mem: "1.1 GB", size: "480 MB", pulled: "3 days ago" },
      { name: "ray-cluster", tag: "2.8.0", status: "warning", containers: 8, cpu: 67, mem: "8.5 GB", size: "2.2 GB", pulled: "1 day ago" },
      { name: "feast", tag: "0.37.0", status: "running", containers: 2, cpu: 9, mem: "512 MB", size: "340 MB", pulled: "5 days ago" },
      { name: "minio", tag: "RELEASE.latest", status: "running", containers: 1, cpu: 4, mem: "256 MB", size: "160 MB", pulled: "1 week ago" },
      { name: "grafana", tag: "10.2.0", status: "running", containers: 1, cpu: 3, mem: "180 MB", size: "280 MB", pulled: "5 days ago" },
    ],
    services: [
      { name: "Model Serving", type: "ML Inference", status: "running", port: "8501", uptime: "99.2%", version: "TorchServe 0.9" },
      { name: "JupyterHub", type: "Compute", status: "running", port: "8000", uptime: "98.8%", version: "4.0.2" },
      { name: "MLflow", type: "ML Tracking", status: "running", port: "5000", uptime: "99.5%", version: "2.9.2" },
      { name: "Ray Cluster", type: "Distributed", status: "warning", port: "8265", uptime: "95.1%", version: "2.8.0" },
      { name: "MinIO", type: "Object Store", status: "running", port: "9000", uptime: "99.9%", version: "Latest" },
      { name: "Prometheus", type: "Monitoring", status: "running", port: "9090", uptime: "99.7%", version: "2.48" },
      { name: "Grafana", type: "Visualization", status: "running", port: "3000", uptime: "99.4%", version: "10.2.0" },
    ],
  },
  {
    id: "tnx-004",
    name: "Zephyr Commerce",
    subdomain: "zephyr",
    email: "admin@zephyr.shop",
    status: "suspended",
    plan: "pro",
    region: "ap-south-1",
    env: "Production",
    created: "2024-04-01",
    billing: "Monthly",
    description: "E-commerce platform for South Asian markets.",
    tags: ["ecommerce", "asia-pacific", "b2c"],
    resources: {
      cpu: 16,
      cpuUsed: 2,
      mem: 64,
      memUsed: 4,
      storage: 500,
      storageUsed: 180,
      maxImages: 10,
    },
    colorIdx: 4,
    images: [
      { name: "shopify-proxy", tag: "2.0.1", status: "stopped", containers: 0, cpu: 0, mem: "\u2014", size: "95 MB", pulled: "2 weeks ago" },
      { name: "payment-svc", tag: "1.5.0", status: "stopped", containers: 0, cpu: 0, mem: "\u2014", size: "120 MB", pulled: "2 weeks ago" },
    ],
    services: [
      { name: "API Gateway", type: "Networking", status: "stopped", port: "8080", uptime: "0%", version: "v2.1" },
      { name: "Payment Service", type: "Payments", status: "stopped", port: "9001", uptime: "0%", version: "1.5.0" },
    ],
  },
  {
    id: "tnx-005",
    name: "DataStream Inc",
    subdomain: "datastream",
    email: "devops@datastream.co",
    status: "active",
    plan: "pro",
    region: "us-east-1",
    env: "Staging",
    created: "2024-05-14",
    billing: "Monthly",
    description: "Real-time data streaming and analytics platform.",
    tags: ["analytics", "streaming", "staging"],
    resources: {
      cpu: 16,
      cpuUsed: 7,
      mem: 32,
      memUsed: 14,
      storage: 200,
      storageUsed: 55,
      maxImages: 8,
    },
    colorIdx: 3,
    images: [
      { name: "apache-flink", tag: "1.18.0", status: "running", containers: 3, cpu: 38, mem: "3.2 GB", size: "780 MB", pulled: "3 days ago" },
      { name: "kafka", tag: "3.6.0", status: "running", containers: 1, cpu: 21, mem: "1.4 GB", size: "650 MB", pulled: "1 week ago" },
      { name: "clickhouse", tag: "23.11", status: "running", containers: 1, cpu: 15, mem: "2.1 GB", size: "590 MB", pulled: "4 days ago" },
    ],
    services: [
      { name: "Flink Cluster", type: "Streaming", status: "running", port: "8081", uptime: "99.1%", version: "1.18.0" },
      { name: "Kafka", type: "Messaging", status: "running", port: "9092", uptime: "99.3%", version: "3.6.0" },
      { name: "ClickHouse", type: "Analytics DB", status: "running", port: "8123", uptime: "98.9%", version: "23.11" },
    ],
  },
  {
    id: "tnx-006",
    name: "BetaWave",
    subdomain: "betawave",
    email: "hello@betawave.dev",
    status: "inactive",
    plan: "starter",
    region: "eu-west-1",
    env: "Development",
    created: "2024-06-01",
    billing: "Monthly",
    description: "Early-stage startup in the developer tooling space.",
    tags: ["startup", "dev-tools", "trial"],
    resources: {
      cpu: 4,
      cpuUsed: 0,
      mem: 8,
      memUsed: 0,
      storage: 50,
      storageUsed: 2,
      maxImages: 3,
    },
    colorIdx: 5,
    images: [
      { name: "node", tag: "20-alpine", status: "stopped", containers: 0, cpu: 0, mem: "\u2014", size: "55 MB", pulled: "3 weeks ago" },
    ],
    services: [
      { name: "Dev Server", type: "Backend", status: "stopped", port: "3001", uptime: "0%", version: "v0.1.0" },
    ],
  },
]
